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