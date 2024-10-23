from db import get_db_connection, PronunciationDirectory, SyllableDirectory
from flask import request, jsonify, send_from_directory
import os
from datetime import datetime, timedelta, timezone, date

def getLeaderBoards():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    print('here')
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())  
    end_of_week = start_of_week + timedelta(days=6)
    
    query = """
        SELECT u.name, u.imagePath, 
               (SELECT SUM(score) FROM dailyScore ds 
                WHERE ds.userPlayerId = v.userPlayerID 
                AND ds.dateDaily BETWEEN %s AND %s) as totalScoreWeekly 
        FROM vista v 
        INNER JOIN user u ON u.UserID = v.userPlayerID 
        WHERE u.isPlayer = 1 AND u.isActive = 1 
        ORDER BY totalScoreWeekly DESC
        LIMIT 10
    """
    cursor.execute(query, (start_of_week, end_of_week))
    vistas = cursor.fetchall()

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

def resetLeaderBoard():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())  
    end_of_week = start_of_week + timedelta(days=6)
    
    delete_query = """
        DELETE FROM dailyScore 
        WHERE dateDaily >= %s AND dateDaily <= %s;
    """
    cursor.execute(delete_query, (start_of_week, end_of_week))
    conn.commit()

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully Retrieved',
        'data': None,
        'data2': None,
        'totalCount': None 
    }), 200

def getStatusVista():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT 
        COUNT(CASE WHEN user.isactive = 1 THEN 1 END) AS active,
        COUNT(CASE WHEN user.isactive = 0 THEN 1 END) AS inactive
    FROM 
        vista 
    INNER JOIN 
        user ON vista.userPlayerID = user.userID;
    """
    cursor.execute(query)
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

def getLanguageUsers():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT l.name as languageName, COUNT(*) AS userCount
            FROM vista
            INNER JOIN user ON user.userId = vista.userPlayerId
            INNER JOIN language l ON l.languageId = vista.currentLanguageId
            WHERE user.isActive = true
            GROUP BY l.name;
    """
    cursor.execute(query)
    vistas = cursor.fetchall()

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

def getSubscriptionData():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
            SELECT 
                s.subscriptionName AS type,
                MONTH(ct.transactionDate) AS month,
                COUNT(ct.subscriptionID) AS subscriptionCount
            FROM 
                coinTransaction ct
            INNER JOIN 
                subscription s ON s.Id = ct.subscriptionId
            GROUP BY 
                s.subscriptionName, MONTH(ct.transactionDate)
            ORDER BY 
                s.subscriptionName, MONTH(ct.transactionDate);

    """
    cursor.execute(query)
    vistas = cursor.fetchall()

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