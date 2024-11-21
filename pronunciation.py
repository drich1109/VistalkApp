from flask import request, jsonify
import io
import librosa
from google.oauth2 import service_account
from google.cloud import speech
import os
from db import get_db_connection
import re
from datetime import date
import soundfile as sf
import tempfile
import json

def checkPronunciation():
    data = request.form
    content_id = int(data.get('contentId', 0))
    userId = int(data.get('userId', 0))
    audio_file = request.files.get('audioFile')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    
    cursor.execute("SELECT numberPronounced FROM vista WHERE userPlayerId = %s", (userId,))
    result = cursor.fetchone()
    if result['numberPronounced'] != None and result['numberPronounced'] <= 0:
        return jsonify({
            'isSuccess': False,
            'message': 'No credits remaining. Please subscribe or try again tomorrow.',
            'data': None
        }), 403  

    
    cursor.execute("SELECT contenttext FROM content WHERE contentID = %s", (content_id,))
    ctext_row = cursor.fetchone()
    if ctext_row:
        ctext = re.sub(r'[^a-zA-Z0-9]', '', ctext_row['contenttext']).lower()

    
    if not audio_file:
        return jsonify({'error': 'No audio file provided'}), 400

    
    temp_audio_path = save_audio_file(audio_file)
    transcription, average_confidence = pronounciate(temp_audio_path)
    transcription = re.sub(r'[^a-zA-Z0-9]', '', transcription).lower()

    score = 1 if transcription == ctext and average_confidence >= 0.75 else 0

    
    insert_query = """
        INSERT INTO pronounciationresult (userPlayerID, contentID, pronunciationScore) VALUES (%s, %s, %s)
    """
    cursor.execute(insert_query, (userId, content_id, score))

    if result['numberPronounced'] != None and result['numberPronounced'] >= 1:
        update_query = """
            UPDATE vista SET numberPronounced = numberPronounced - 1 WHERE userPlayerId = %s AND numberPronounced > 0
        """
        cursor.execute(update_query, (userId,))
    
    conn.commit()

    
    if score == 1:
        update_event_logs(userId)
        return jsonify({
            'isSuccess': True,
            'message': 'Correct',
            'data': transcription,
            'data2': None,
            'totalCount': None  
        }), 200
    else:
        return jsonify({
            'isSuccess': False,
            'message': 'Incorrect',
            'data': transcription,
            'data2': None,
            'totalCount': None  
        }), 200

def save_audio_file(audio_file):
    
    temp_dir = tempfile.gettempdir()  
    temp_audio_path = os.path.join(temp_dir, audio_file.filename)
    
    
    audio_file.save(temp_audio_path)
    return temp_audio_path

def convert_to_flac(audio_file):
    # Load the audio file using librosa
    audio_data, sample_rate = librosa.load(audio_file, sr=None, mono=False)
    channels = 1 if audio_data.ndim == 1 else 2
    
    # Save as FLAC using soundfile
    flac_file = os.path.splitext(audio_file)[0] + ".flac"
    sf.write(flac_file, audio_data.T, sample_rate, format='FLAC')
    return flac_file, channels

def pronounciate(audio_file):
    credentials_info = json.loads(os.getenv("GOOGLE_CLOUD_CREDENTIALS"))
    credentials = service_account.Credentials.from_service_account_info(credentials_info)
    client = speech.SpeechClient(credentials=credentials)
    
    languageCode = "fil-PH"

    if not audio_file.lower().endswith('.flac'):
        file_path, channels = convert_to_flac(file_path)
    else:
        audio_data, sample_rate = librosa.load(audio_file, sr=None, mono=False)
        channels = 1 if audio_data.ndim == 1 else 2

    audio_data, sample_rate = librosa.load(audio_file, sr=None, mono=False)
    
    
    with io.open(audio_file, 'rb') as f:
        content = f.read()
    audio = speech.RecognitionAudio(content=content)
    
    encoding = speech.RecognitionConfig.AudioEncoding.FLAC  
    
    
    config = speech.RecognitionConfig(
        encoding=encoding,  
        sample_rate_hertz=sample_rate,  
        language_code=languageCode,  
        audio_channel_count=channels,  
        model="default"  
    )
    
    
    response = client.recognize(config=config, audio=audio)
    print(response)
    
    if not response.results:
        print("No transcription results. Check audio configuration and language support.")
        return None
    else:
        transcription = ""
        confidences = []  

        for result in response.results:
            alternative = result.alternatives[0]
            transcription += alternative.transcript + " "
            confidences.append(alternative.confidence)

        
        average_confidence = sum(confidences) / len(confidences) if confidences else 0

        return transcription.strip(), average_confidence


def getPronunciationProgress():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    userId = request.args.get('userId')
    contentId = request.args.get('contentId')
    
    query = """
        SELECT 
            SUM(pronunciationScore = 1) AS correct, 
            SUM(pronunciationScore = 0) AS incorrect 
        FROM 
            pronounciationresult 
        WHERE 
            userPlayerID = %s
    """
    
    values = [userId]  
    if contentId is not None:
        query += " AND contentID = %s"
        values.append(contentId)
        
    cursor.execute(query, tuple(values))  
    vistas = cursor.fetchone()

    if not vistas:
        return jsonify({
            'isSuccess': True,
            'message': 'No sections found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully Retrieved',
        'data': vistas,
        'data2': None,
        'totalCount': None 
    }), 200

    
def getPronunciationList():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    userId = request.args.get('userId')
    contentId = request.args.get('contentId')
    
    query = """
        SELECT resultId, pr.contentId, c.contentText, pronunciationScore FROM pronounciationresult pr
        inner join content c on c.contentId =  pr.contentId
        WHERE 
        userPlayerID = %s
    """
    
    values = [userId]  
    if contentId is not None:
        query += " AND pr.contentID = %s"
        values.append(contentId)
        
    query += """ORDER BY resultId desc
            """
            
    cursor.execute(query, tuple(values))  
    vistas = cursor.fetchall()  

    if not vistas:
        return jsonify({
            'isSuccess': True,
            'message': 'No records found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully Retrieved',
        'data': vistas,
        'data2': None,
        'totalCount': len(vistas)  
    }), 200


def getPronunciationCount():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    userId = request.args.get('userId')
    
    query = """
        SELECT 
            numberPronounced
        FROM 
            vista 
        WHERE 
            userPlayerID = %s
    """    
    values = [userId] 
        
    cursor.execute(query, tuple(values))  
    vistas = cursor.fetchone()

    if not vistas:
        return jsonify({
            'isSuccess': True,
            'message': 'No sections found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully Retrieved',
        'data': vistas,
        'data2': None,
        'totalCount': None 
    }), 200


def update_event_logs(userId):
    today = date.today()
    
    conn = get_db_connection()
    cursor = conn.cursor()

    
    query_fetch_event_logs = """
        SELECT dt.powerUpId, dt.taskTypeId, dt.taskId, el.currentValue
        FROM eventlogs el
        INNER JOIN dailytask dt ON el.dailyTaskId = dt.taskId
        inner join playerdailytask pdt on pdt.taskID = dt.taskId
        WHERE el.eventDate = %s AND el.userPlayerId = %s and pdt.isCompleted = 0
    """
    cursor.execute(query_fetch_event_logs, (today, userId))
    event_logs = cursor.fetchall()

    
    query_fetch_daily_tasks = """
        SELECT pdt.taskId, dt.quantity as requiredQuantity 
        FROM playerdailytask pdt
        INNER JOIN dailytask dt ON pdt.taskId = dt.taskId
        WHERE pdt.userPlayerId = %s AND dt.taskDate = %s
    """
    cursor.execute(query_fetch_daily_tasks, (userId, today))
    daily_tasks = cursor.fetchall()  

    
    for event_log in event_logs:
        taskTypeId = event_log[1]
        taskId = event_log[2]
        currentValue = event_log[3]

        if taskTypeId == 3:
            
            query_update_task_type_1 = """
                UPDATE eventlogs
                SET currentValue = currentValue + 1
                WHERE userPlayerId = %s AND dailyTaskId = %s AND eventDate = %s
            """
            cursor.execute(query_update_task_type_1, (userId, taskId, today))

        
            query_refetch_current_value = """
                SELECT currentValue FROM eventlogs
                WHERE userPlayerId = %s AND dailyTaskId = %s AND eventDate = %s
            """
            
            cursor.execute(query_refetch_current_value, (userId, taskId, today))
            updated_current_value = cursor.fetchone()
            if updated_current_value is not None:
                currentValue = updated_current_value[0]

            
    for daily_task in daily_tasks:
        daily_task_id = daily_task[0]
        required_quantity = daily_task[1]

                
        if taskId == daily_task_id and currentValue >= required_quantity:
            print('loop',daily_task)

            query_update_daily_task = """
                        UPDATE playerdailytask
                        SET isCompleted = 1
                        WHERE userPlayerId = %s AND taskId = %s
                    """
            cursor.execute(query_update_daily_task, (userId, daily_task_id))

            query_insert_message = """
                        INSERT INTO notifications (userPlayerId, message, isOpened)
                        VALUES (%s, %s, %s)
                    """
            notification_message = f"Task {daily_task_id} completed!"
            cursor.execute(query_insert_message, (userId, notification_message, 0))

    conn.commit()
    cursor.close()
