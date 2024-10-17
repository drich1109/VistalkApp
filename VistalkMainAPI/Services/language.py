from flask import request, jsonify, send_from_directory
from db import get_db_connection

def get_Language():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM language"
    cursor.execute(query)
    languages = cursor.fetchall()
    if not languages:
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
                'data': languages,
                'data2': None,
                'totalCount': None 
            }), 200

def getUserLanguage():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        userID = request.args.get('userID')
        print(userID)
        query = "SELECT l.* FROM vista v inner join language l on l.languageID = v.currentLanguageId WHERE v.userPlayerID = %s"
        values = [userID,]
        cursor.execute(query, values)
        languages = cursor.fetchone()
        if not languages:
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
            'data': languages,
            'data2': None,
            'totalCount': None 
        }), 200
    finally:
        conn.close() 