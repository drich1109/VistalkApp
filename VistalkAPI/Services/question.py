# user.py
from db import get_db_connection
from flask import request, jsonify, send_from_directory
import os

QuestionFiles =  'C:\\VistalkApp\\VistalkApp\\QuestionFiles'

def get_QuestionTypes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM questiontype order by typeName"
    cursor.execute(query)
    questionTypes = cursor.fetchall()
    if not questionTypes:
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
                'data': questionTypes,
                'data2': None,
                'totalCount': None 
            }), 200

def get_choices():
    langID = request.args.get('languageID')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM content where languageID = %s
    """
    values = [langID,]

    cursor.execute(query, tuple(values))
    contents = cursor.fetchall()
    count_query = "SELECT COUNT(*) as total FROM content WHERE languageID = %s"
    countvalues = [langID]

    cursor.execute(count_query, tuple(countvalues))
    total_count = cursor.fetchone()['total']

    if not contents:
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
                'data': contents,
                'data2': None,
                'totalCount': total_count
            }), 200

def save_questionMultiple():
    data = request.form
    
    question_text = data.get('questionText')
    unit_id = int(data.get('unitId'))
    questionTypeID = int(data.get('questionTypeID'))
    choices = [
        int(data.get('choice1')),
        int(data.get('choice2')),
        int(data.get('choice3')),
        int(data.get('choice4'))
    ]
    correct_choice = int(data.get('correctChoice'))

    conn = get_db_connection()
    cursor = conn.cursor()
    image_path = data.get('imagePath')
    audio_path = data.get('audioPath')
    print(questionTypeID)
    cursor.execute(
        '''
        INSERT INTO question (questionText, unitId, questionTypeID)
        VALUES (%s, %s, %s)
        ''',
        (question_text, unit_id, questionTypeID)
    )

    conn.commit()
    question_id = cursor.lastrowid

    file = request.files.get('file')

    if file:
        if image_path:
            unique_filename = f"{question_id}_{image_path}"
            file_path = os.path.join(QuestionFiles, unique_filename)
            file.save(file_path)
            
            cursor.execute(
                '''
                UPDATE question
                SET imagePath = %s
                WHERE questionId = %s
                ''',
                (unique_filename, question_id)
            )
        elif audio_path:
            unique_filename = f"{question_id}_{audio_path}"
            file_path = os.path.join(QuestionFiles, unique_filename)
            file.save(file_path)
            
            cursor.execute(
                '''
                UPDATE question
                SET audioPath = %s
                WHERE questionId = %s
                ''',
                (unique_filename, question_id)
            )

    cursor.execute(
        '''
        INSERT INTO questionChoice (questionID, choice1, choice2, choice3, choice4, correctChoice)
        VALUES (%s, %s, %s, %s, %s, %s)
        ''',
        (question_id, choices[0], choices[1], choices[2], choices[3], correct_choice)
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Question and choices saved successfully.'}), 200


def save_question_match():
    data = request.json

    question_text = data.get('questionText')
    unit_id = data.get('unitId')
    question_type_id = data.get('questionTypeID')
    choices = [
        data.get('choice1'),
        data.get('choice2'),
        data.get('choice3'),
        data.get('choice4'),
        data.get('match1'),
        data.get('match2'),
        data.get('match3'),
        data.get('match4')
    ]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        INSERT INTO question (questionText, unitId, questionTypeID)
        VALUES (%s, %s, %s)
        ''',
        (question_text, unit_id, question_type_id)
    )

    conn.commit()
    question_id = cursor.lastrowid

    cursor.execute(
        '''
        INSERT INTO questionmatchingtype (questionID, word1, word2, word3, word4, match1, match2, match3, match4)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''',
        (question_id, choices[0], choices[1], choices[2], choices[3], choices[4], choices[5], choices[6], choices[7])
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Question and choices saved successfully.'}), 200