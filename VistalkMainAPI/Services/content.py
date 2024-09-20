from db import get_db_connection
from flask import request, jsonify

def get_Content():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    searchString = request.args.get('searchString')
    query = """SELECT * FROM content WHERE isInDictionary = 1"""

    print(searchString)
    if searchString:
        query += "AND (WHERE contentText LIKE %s OR englishTranslation LIKE %s)"
        cursor.execute(query + " ORDER BY contentText", ('%' + searchString + '%', '%' + searchString + '%'))
    else:
        cursor.execute(query + " ORDER BY contentText")
    
    content = cursor.fetchall()
    if not content:
        return jsonify({
            'isSuccess': True,
            'message': 'No content found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully Retrieved',
        'data': content,
        'data2': None,
        'totalCount': len(content)
    }), 200