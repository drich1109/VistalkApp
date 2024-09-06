from flask import request, jsonify
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