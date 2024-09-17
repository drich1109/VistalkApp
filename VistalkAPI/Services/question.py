# user.py
from db import get_db_connection, QuestionFiles
from flask import request, jsonify, send_from_directory
import os

QuestionFiles =  QuestionFiles

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

def get_Questions():
    unitId = request.args.get('unitId')
    searchString = request.args.get('searchString')
    pageNo = int(request.args.get('pageNo', 1))
    pageSize = 15
    offset = (pageNo - 1) * pageSize
    conn = get_db_connection()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            q.*,
            qt.typeName 
        FROM 
            question q
        INNER JOIN 
            questiontype qt 
        ON 
            q.questionTypeID = qt.typeID
        WHERE 
            q.unitId = %s
            AND q.isActive = true
    """
    values = [unitId]

    if searchString:
        query += "AND (questionText LIKE %s OR questionTypeID LIKE %s)"
        likePattern = f"%{searchString}%"
        values.extend([likePattern, likePattern])

    query += """
        ORDER BY questionTypeID
        LIMIT %s OFFSET %s
    """
    values.extend([pageSize, offset])

    cursor.execute(query, tuple(values))
    quesions = cursor.fetchall()

    count_query = "SELECT COUNT(*) as total FROM question WHERE unitId = %s"
    countvalues = [unitId]
    if searchString:
        count_query += " AND (questionText LIKE %s OR questionTypeID LIKE %s)"
        likePattern = f"%{searchString}%"
        countvalues.extend([likePattern, likePattern])

    cursor.execute(count_query, tuple(countvalues))
    total_count = cursor.fetchone()['total']

    if not quesions:
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
        'data': quesions,
        'data2': None,
        'totalCount': total_count
    }), 200

def save_questionMultiple():
    data = request.form
    question_ID = data.get('questionID', 0, type=int)
    question_text = data.get('questionText')
    unit_id = data.get('unitId', type=int)
    questionTypeID = data.get('questionTypeID', type=int)
    
    choices = [
        data.get('choice1', type=int),
        data.get('choice2', type=int),
        data.get('choice3', type=int),
        data.get('choice4', type=int)
    ]
    
    correct_choice = data.get('correctChoice', type=int)
    image_path = data.get('imagePath')
    audio_path = data.get('audioPath')

    conn = get_db_connection()
    cursor = conn.cursor()

    if question_ID == 0 or question_ID is None:
        query = """INSERT INTO question (questionText, unitId, questionTypeID) VALUES (%s, %s, %s)"""
        values = (question_text, unit_id, questionTypeID)
        cursor.execute(query, values)
        conn.commit()
        question_id = cursor.lastrowid

        query_update = """
        UPDATE unit 
        SET totalItems = totalItems + 1
        WHERE unitID = %s
        """
        values_update = (unit_id,)
        cursor.execute(query_update, values_update)
        conn.commit()

        file = request.files.get('file')

        if file:
            if image_path or audio_path:

                if image_path:
                    safe_filename = f"{question_text.replace(' ', '_')}.png"
                    cursor.execute('UPDATE question SET imagePath = %s WHERE questionId = %s', (safe_filename, question_id))
                    file_path = os.path.join(QuestionFiles, safe_filename)
                    file.save(file_path)
                elif audio_path:
                    safe_filename = f"{question_text.replace(' ', '_')}.mp3"
                    cursor.execute('UPDATE question SET audioPath = %s WHERE questionId = %s', (safe_filename, question_id))
                    file_path = os.path.join(QuestionFiles, safe_filename)
                    file.save(file_path)

        cursor.execute(
            '''
            INSERT INTO questionChoice (questionID, choice1, choice2, choice3, choice4, correctChoice)
            VALUES (%s, %s, %s, %s, %s, %s)
            ''',
            (question_id, *choices, correct_choice)
        )
        conn.commit()
    else:
        # Update an existing question
        query = """UPDATE question SET questionText = %s, unitId = %s WHERE questionID = %s"""
        values = (question_text, unit_id, question_ID)
        cursor.execute(query, values)
        conn.commit()

        cursor.execute(
            """
            UPDATE questionChoice 
            SET choice1 = %s, choice2 = %s, choice3 = %s, choice4 = %s, correctChoice = %s 
            WHERE questionID = %s
            """,
            (*choices, correct_choice, question_ID)
        )
        conn.commit()
        file = request.files.get('file')

        if file:
            if image_path or audio_path:

                if image_path:
                    print(question_ID)
                    safe_filename = f"{question_text.replace(' ', '_')}.png"
                    cursor.execute('UPDATE question SET imagePath = %s, audioPath = null WHERE questionId = %s', (safe_filename, question_ID))
                    conn.commit()
                    file_path = os.path.join(QuestionFiles, safe_filename)
                    file.save(file_path)
                elif audio_path:
                    print(question_ID)
                    safe_filename = f"{question_text.replace(' ', '_')}.mp3"
                    print(safe_filename)
                    cursor.execute('UPDATE question SET audioPath = %s, imagePath = null WHERE questionId = %s', (safe_filename, question_ID))
                    conn.commit()
                    file_path = os.path.join(QuestionFiles, safe_filename)
                    file.save(file_path)

    conn.close()
    return jsonify({'message': 'Question and choices saved successfully.'}), 200


def get_multiple_choice():
    questionID = request.args.get('questionID')
    print(questionID)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary = True)
    query = """
        SELECT * FROM questionchoice WHERE questionID = %s
    """
    values = [questionID]
    cursor.execute(query, tuple(values))
    multiple_choices = cursor.fetchone()
    print(multiple_choices)
    count_query = "SELECT COUNT(*) as total FROM questionchoice WHERE questionID = %s"
    countvalues = [questionID]

    cursor.execute(count_query, tuple(countvalues))
    total_count = cursor.fetchone()['total']

    if not multiple_choices:
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
                'data': multiple_choices,
                'data2': None,
                'totalCount': total_count
            }), 200
  
def get_matching_type():
    questionMatchingTypeID = request.args.get('questionMatchingTypeID')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary = True)
    query = """
        SELECT * FROM questionmatchingtype WHERE questionMatchingTypeID = %s
    """
    cursor.execute(query, tuple(questionMatchingTypeID,))
    matching_type = cursor.fetchone()
    count_query = "SELECT COUNT(*) as total FROM questionmatchingtype WHERE questionMatchingTypeID = %s"
    countvalues = [questionMatchingTypeID]

    cursor.execute(count_query, tuple(countvalues))
    total_count = cursor.fetchone()['total']

    if not matching_type:
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
                'data': matching_type,
                'data2': None,
                'totalCount': total_count
            }), 200

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
    query_update = """
        UPDATE unit 
        SET totalItems = totalItems + 1
        WHERE unitID = %s
        """
    values_update = (unit_id,)
    cursor.execute(query_update, values_update)
    conn.commit()

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

def questionInactive():
    questionID = int(request.args.get('questionID'))
    unit_id = int(request.args.get('unitID'))
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        UPDATE question SET isActive = false where questionID = %s
    """
    values = [questionID,]
    cursor.execute(query, values)
    conn.commit()

    query_update = """
        UPDATE unit 
        SET totalItems = totalItems - 1
        WHERE unitID = %s
        """
    values_update = (unit_id,)
    cursor.execute(query_update, values_update)
    conn.commit()

    return jsonify({'isSuccess': True, "message": "Content updated successfully"}), 200

def getQuestionFile():
    fileName = request.args.get('fileName')
    return send_from_directory(QuestionFiles, fileName)