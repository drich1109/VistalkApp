# user.py
from db import get_db_connection
from flask import request, jsonify

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

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM unit
        WHERE sectionID = %s and isActive = true
    """
    values = [sectionID]

    cursor.execute(query, tuple(values))
    units = cursor.fetchall()

    if not units:
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
                'data': units,
                'data2': None,
                'totalCount': 1
            }), 200