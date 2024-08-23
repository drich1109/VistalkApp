# user.py
from db import get_db_connection
from flask import request, jsonify
import os
import json

UPLOAD_FOLDER = 'C://VistalkApp//VistalkApp//Vistalk Pronunciation Audio'

# Ensure the directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def get_ContentTypes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM contentType"
    cursor.execute(query)
    contentTypes = cursor.fetchall()
    if not contentTypes:
        return jsonify({
            'isSuccess': True,
            'message': 'No types found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': contentTypes,
                'data2': None,
                'totalCount': None 
            }), 200

def save_content():
    content_data = request.form.get('content')
    
    # Debug: Check if the content_data is None
    if content_data is None:
        print("No content data found in form")
        return jsonify({'isSuccess': False, 'message': 'Content data is missing'}), 400

    content_data = json.loads(content_data)

    syllables_data = content_data['syllables']
    definitions_data = content_data['definitions']
    examples_data = content_data['examples']

    audio_file = request.files.get('audioFile')

    # Save the audio file
    audio_file_path = None
    if audio_file:
        save_directory = 'C://VistalkApp//VistalkApp//Vistalk Pronunciation Audio'
        if not os.path.exists(save_directory):
            os.makedirs(save_directory)
        audio_file_path = os.path.join(save_directory, audio_file.filename)
        audio_file.save(audio_file_path)

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if content_data['contentId'] == 0:
            if audio_file:
                audio_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
                audio_file.save(audio_path)
                content_data['audioPath'] = audio_path
                print(audio_path)
            sql_content = """
                INSERT INTO content (contentText, englishTranslation, audioPath, languageId, contentTypeId)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql_content, (
                content_data['contentText'],
                content_data['englishTranslation'],
                content_data['audioPath'],
                content_data['languageId'],
                content_data['contentTypeId']
            ))
            conn.commit()
            content_id = cursor.lastrowid

            for syllable in syllables_data:
                sql_syllable = """
                    INSERT INTO contentsyllable (contentId, syllableText, audioPath, orderNumber)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_syllable, (
                    content_id,
                    syllable['syllableText'],
                    syllable['audioPath'],
                    syllable['orderNumber']
                ))
                
                conn.commit()

            for definition in definitions_data:
                sql_definition = """
                    INSERT INTO contentDefinition (contentId, nativeDefinition, englishDefinition, orderNumber)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_definition, (
                    content_id,
                    definition['nativeDefinition'],
                    definition['englishDefinition'],
                    definition['orderNumber']
                ))
                conn.commit()
            for example in examples_data:
                sql_example = """
                    INSERT INTO contentExample (contentId, nativeExample, englishExample, orderNumber)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_example, (
                    content_id,
                    example['nativeExample'],
                    example['englishExample'],
                    example['orderNumber']
                ))
                conn.commit()

        else:
            content_id = content_data['contentId']
            sql_update_content = """
                UPDATE content
                SET contentText = %s, englishTranslation = %s, audioPath = %s, languageId = %s, contentTypeId = %s
                WHERE contentId = %s
            """
            cursor.execute(sql_update_content, (
                content_data['contentText'],
                content_data['englishTranslation'],
                content_data['audioPath'],
                content_data['languageId'],
                content_data['contentTypeId'],
                content_id
            ))
        conn.commit()
        return jsonify({'isSuccess': True, "message": "Content saved successfully"}), 201

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'isSuccess': False, "message": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_Contents():
    langID = request.args.get('languageID')
    contentTypeId = request.args.get('contentTypeID')
    searchString = request.args.get('searchString')
    pageNo = int(request.args.get('pageNo', 1))
    pageSize = 15
    offset = (pageNo - 1) * pageSize
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM content where languageID = %s
    """
    values = [langID,]

    if searchString:
        query += "AND (contentText LIKE %s OR englishTranslation LIKE %s)"
        likePattern = f"%{searchString}%"
        values.extend([likePattern, likePattern])
    
    if contentTypeId:
        query += "AND (contentTypeId = %s)"
        values.extend([contentTypeId])

    query += """
        ORDER BY contentText
        LIMIT %s OFFSET %s
    """
    values.extend([pageSize, offset])

    cursor.execute(query, tuple(values))
    units = cursor.fetchall()
    count_query = "SELECT COUNT(*) as total FROM content WHERE languageID = %s"
    countvalues = [langID]
    if searchString:
        count_query += " AND (contentText LIKE %s OR englishTranslation LIKE %s)"
        likePattern = f"%{searchString}%"
        countvalues.extend([likePattern, likePattern])

    if contentTypeId:
        count_query += "AND (contentTypeId = %s)"
        countvalues.extend([contentTypeId])

    cursor.execute(count_query, tuple(countvalues))
    total_count = cursor.fetchone()['total']

    if not units:
        return jsonify({
            'isSuccess': True,
            'message': 'No contents found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': units,
                'data2': None,
                'totalCount': total_count
            }), 200