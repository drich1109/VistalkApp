# user.py
from db import get_db_connection, QuestionFiles
from flask import request, jsonify, send_from_directory

def get_Sections():
    langID = request.args.get('languageId')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """SELECT 
                s.*, 
                COUNT(u.unitId) AS unitCount
                FROM section s
                LEFT JOIN unit u ON u.sectionId = s.sectionId
                WHERE s.languageID = %s
                AND s.isActive = true
                AND u.isActive=true
                GROUP BY s.sectionId"""
    values = (langID,)
    cursor.execute(query, values)
    sections = cursor.fetchall()
    for section in sections:
        section['isPremium'] = bool(section['isPremium'])
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
                'totalCount': None 
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
                CASE 
                    WHEN uu.totalScore = 0 THEN 0 
                    ELSE u.totalItems - uu.totalCorrectAnswers 
                END AS totalWrong, 
                uu.totalScore,
                CASE 
                    WHEN prev_uu.totalScore IS NULL OR prev_uu.totalScore = 0 THEN TRUE 
                    ELSE FALSE 
                END AS isLock
            FROM 
                unit u
            INNER JOIN 
                userUnit uu ON uu.unitID = u.unitID
            LEFT JOIN (
                SELECT 
                    prev_u.unitNumber,
                    prev_u.sectionID,
                    prev_uu.userPlayerID,
                    prev_uu.totalScore
                FROM 
                    unit prev_u
                INNER JOIN 
                    userUnit prev_uu ON prev_uu.unitID = prev_u.unitID
            ) prev_uu ON prev_uu.unitNumber = u.unitNumber - 1 
                    AND prev_uu.sectionID = u.sectionID 
                    AND prev_uu.userPlayerID = uu.userPlayerID
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
        'totalCount': 1
    }), 200

def update_user_unit(mainUnits, userId):
    conn = get_db_connection()
    cursor = conn.cursor()

    for unit in mainUnits:
        unitId = unit['unitID']

        query_check = """
            SELECT COUNT(*) FROM userUnit 
            WHERE userPlayerID = %s AND unitID = %s
        """
        cursor.execute(query_check, (userId, unitId))
        exists = cursor.fetchone()[0]
        if exists == 0:
            query_insert = """
                INSERT INTO userUnit (userPlayerID, unitID, totalCorrectAnswers, totalScore) 
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query_insert, (userId, unitId, 0, 0))

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
            questionChoice qc ON qc.questionId = q.questionId
        LEFT JOIN 
            content cc1 ON qc.choice1 = cc1.contentID
        LEFT JOIN 
            content cc2 ON qc.choice2 = cc2.contentID
        LEFT JOIN 
            content cc3 ON qc.choice3 = cc3.contentID
        LEFT JOIN 
            content cc4 ON qc.choice4 = cc4.contentID
        LEFT JOIN 
            questionMatchingType qm ON qm.questionId = q.questionID
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
            AND q.isActive = TRUE;
    """
    values = [unitId]

    cursor.execute(query, tuple(values))
    questions = cursor.fetchall()

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
                'totalCount': 1
            }), 200

def getQuestionFiles():
    fileName = request.args.get('fileName')
    timestamp = request.args.get('t')
    try:
        return send_from_directory(QuestionFiles, fileName)
    except FileNotFoundError:
        return None