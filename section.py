
from db import get_db_connection
from flask import request, jsonify
import random

def get_Sections():
    langID = request.args.get('languageId')
    userID = request.args.get('userId')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    
    query_subscriber = """
        SELECT isPremium 
        FROM vista 
        WHERE userPlayerID = %s
    """
    cursor.execute(query_subscriber, (userID,))
    subscriber_result = cursor.fetchone()
    is_subscriber = subscriber_result['isPremium'] if subscriber_result else False
    query = """SELECT 
                    s.*, 
                    COUNT(DISTINCT u.unitId) AS unitCount,
                    COUNT(DISTINCT uu.unitID) AS completedUnitCount
                FROM 
                    section s
                LEFT JOIN 
                    unit u ON u.sectionId = s.sectionId AND u.isActive = true
                LEFT JOIN 
                    userunit uu ON uu.unitId = u.unitId 
                                AND uu.userPlayerID = %s  
                                AND uu.totalScore != 0 
                                AND uu.isLocked = 0
                WHERE 
                    s.languageID = %s
                    AND s.isActive = true
                GROUP BY 
                    s.sectionId"""
    values = (userID, langID)
    cursor.execute(query, values)
    sections = cursor.fetchall()

    for section in sections:
        section['isPremium'] = bool(section['isPremium'])
        
        if is_subscriber and section['isPremium']:
            section['isAccessible'] = True
        elif not is_subscriber and section['isPremium']:
            section['isAccessible'] = False
        else:
            section['isAccessible'] = True

              
    if not sections:
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
        'data': sections,
        'data2': None,
        'totalCount': len(sections)  
    }), 200
    
def get_Units():
    sectionID = request.args.get('sectionId')
    userId = request.args.get('userId')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query_main = """
        SELECT * FROM unit
        WHERE sectionID = %s AND isActive = true
    """
    cursor.execute(query_main, (sectionID,))
    mainUnits = cursor.fetchall()

    query_user = """
        SELECT 
            u.*, 
            uu.totalCorrectAnswers AS totalCorrect, 
            u.totalItems - uu.totalCorrectAnswers AS totalWrong, 
            uu.totalScore, 
            uu.isLocked 
        FROM 
            unit u
        INNER JOIN 
            userunit uu ON uu.unitID = u.unitID
        WHERE 
            u.sectionID = %s 
            AND u.isActive = true 
            AND uu.userPlayerID = %s
        ORDER BY 
            u.unitNumber;
    """
    cursor.execute(query_user, (sectionID, userId))
    userUnits = cursor.fetchall()

    if not mainUnits:
        return jsonify({
            'isSuccess': True,
            'message': 'No units found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200

    main_unit_ids = {unit['unitID'] for unit in mainUnits}
    user_unit_ids = {unit['unitID'] for unit in userUnits}

    if main_unit_ids != user_unit_ids:
        update_user_unit(mainUnits, userId)
        cursor.execute(query_user, (sectionID, userId))
        userUnits = cursor.fetchall()

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully Retrieved',
        'data': userUnits,
        'data2': [],
        'totalCount': len(userUnits)
    }), 200

def update_user_unit(mainUnits, userId):
    conn = get_db_connection()
    cursor = conn.cursor()

    for unit in mainUnits:
        unitId = unit['unitID']

        query_check = """
            SELECT COUNT(*) FROM userunit 
            WHERE userPlayerID = %s AND unitID = %s
        """
        cursor.execute(query_check, (userId, unitId))
        exists = cursor.fetchone()[0]
        if exists == 0:
            query_insert = """
                INSERT INTO userunit (userPlayerID, unitID, totalCorrectAnswers, totalScore, isLocked) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query_insert, (userId, unitId, 0, 0, True))  

    conn.commit()


def getUnitQuestions():
    unitId = request.args.get('unitId')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
       SELECT 
            q.*,
            qc.questionChoiceID, qc.correctChoice, qc.choice1, qc.choice2, qc.choice3, qc.choice4,
            cc1.contentText AS choice1ContentText, cc1.englishTranslation AS choice1EnglishTranslation, cc1.audioPath AS choice1AudioPath,
            cc2.contentText AS choice2ContentText, cc2.englishTranslation AS choice2EnglishTranslation, cc2.audioPath AS choice2AudioPath,
            cc3.contentText AS choice3ContentText, cc3.englishTranslation AS choice3EnglishTranslation, cc3.audioPath AS choice3AudioPath,
            cc4.contentText AS choice4ContentText, cc4.englishTranslation AS choice4EnglishTranslation, cc4.audioPath AS choice4AudioPath,
            qm.questionMatchingTypeID, qm.word1, qm.match1, qm.word2, qm.match2, qm.word3, qm.match3, qm.word4, qm.match4,
            wm1.contentText AS word1ContentText, wm1.englishTranslation AS word1EnglishTranslation, wm1.audioPath AS word1AudioPath,
            wm2.contentText AS word2ContentText, wm2.englishTranslation AS word2EnglishTranslation, wm2.audioPath AS word2AudioPath,
            wm3.contentText AS word3ContentText, wm3.englishTranslation AS word3EnglishTranslation, wm3.audioPath AS word3AudioPath,
            wm4.contentText AS word4ContentText, wm4.englishTranslation AS word4EnglishTranslation, wm4.audioPath AS word4AudioPath,
            mm1.contentText AS match1ContentText, mm1.englishTranslation AS match1EnglishTranslation, mm1.audioPath AS match1AudioPath,
            mm2.contentText AS match2ContentText, mm2.englishTranslation AS match2EnglishTranslation, mm2.audioPath AS match2AudioPath,
            mm3.contentText AS match3ContentText, mm3.englishTranslation AS match3EnglishTranslation, mm3.audioPath AS match3AudioPath,
            mm4.contentText AS match4ContentText, mm4.englishTranslation AS match4EnglishTranslation, mm4.audioPath AS match4AudioPath
        FROM 
            question q 
        LEFT JOIN 
            questionchoice qc ON qc.questionId = q.questionId
        LEFT JOIN 
            content cc1 ON qc.choice1 = cc1.contentID
        LEFT JOIN 
            content cc2 ON qc.choice2 = cc2.contentID
        LEFT JOIN 
            content cc3 ON qc.choice3 = cc3.contentID
        LEFT JOIN 
            content cc4 ON qc.choice4 = cc4.contentID
        LEFT JOIN 
            questionmatchingtype qm ON qm.questionId = q.questionID
        LEFT JOIN 
            content wm1 ON qm.word1 = wm1.contentID
        LEFT JOIN 
            content wm2 ON qm.word2 = wm2.contentID
        LEFT JOIN 
            content wm3 ON qm.word3 = wm3.contentID
        LEFT JOIN 
            content wm4 ON qm.word4 = wm4.contentID
        LEFT JOIN 
            content mm1 ON qm.match1 = mm1.contentID
        LEFT JOIN 
            content mm2 ON qm.match2 = mm2.contentID
        LEFT JOIN 
            content mm3 ON qm.match3 = mm3.contentID
        LEFT JOIN 
            content mm4 ON qm.match4 = mm4.contentID
        WHERE 
            q.unitID = %s 
            AND q.isActive = TRUE
        ORDER BY RAND()
        LIMIT 15;
    """
    values = [unitId]

    cursor.execute(query, tuple(values))
    questions = cursor.fetchall()

    for question in questions:
        if question['questionChoiceID'] is not None:
            choices = [
                {
                    "choiceID": question['choice1'],
                    "contentText": question['choice1ContentText'],
                    "englishTranslation": question['choice1EnglishTranslation'],
                    "audioPath": question['choice1AudioPath'],
                },
                {
                    "choiceID": question['choice2'],
                    "contentText": question['choice2ContentText'],
                    "englishTranslation": question['choice2EnglishTranslation'],
                    "audioPath": question['choice2AudioPath'],
                },
                {
                    "choiceID": question['choice3'],
                    "contentText": question['choice3ContentText'],
                    "englishTranslation": question['choice3EnglishTranslation'],
                    "audioPath": question['choice3AudioPath'],
                },
                {
                    "choiceID": question['choice4'],
                    "contentText": question['choice4ContentText'],
                    "englishTranslation": question['choice4EnglishTranslation'],
                    "audioPath": question['choice4AudioPath'],
                },
            ]
            random.shuffle(choices)

            # Update the question with shuffled choices
            for i, choice in enumerate(choices, start=1):
                question[f'choice{i}'] = choice['choiceID']
                question[f'choice{i}ContentText'] = choice['contentText']
                question[f'choice{i}EnglishTranslation'] = choice['englishTranslation']
                question[f'choice{i}AudioPath'] = choice['audioPath']
                
    if not questions:
        return jsonify({
            'isSuccess': True,
            'message': 'No units found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': questions,
                'data2': None,
                'totalCount': len(questions)
            }), 200
