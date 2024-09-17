from flask import request, jsonify, send_from_directory
from db import UserImages, get_db_connection
from datetime import datetime


def getUserImage():
    fileName = request.args.get('fileName')
    timestamp = request.args.get('t')
    try:
        return send_from_directory(UserImages, fileName)
    except FileNotFoundError:
        return None

def getUserDetails():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    userID = request.args.get('userID')
    query = """Select u.UserID as id, u.name, u.email, u.imagePath, v.vCoin, v.currentLanguageId, v.totalScoreWeekly, v.vcoin 
                from user u 
                inner join vista v on u.userID = v.userPlayerID 
                WHERE u.isActive = true and u.isPlayer = true AND v.userPlayerID = %s"""
    values = [userID,]
    cursor.execute(query, values)
    userProfile = cursor.fetchone()
    print(userProfile)
    if not userProfile:
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
                'data': userProfile,
                'data2': None,
                'totalCount': None 
            }), 200

def add_feedback():
    data = request.json
    user_player_id = data.get('userId') 
    feedback_text = data.get('feedback')
    print(user_player_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    feedback_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    query = """
            INSERT INTO userfeedback (userPlayerID, feedbackDate, feedbackText)
            VALUES (%s, %s, %s)
        """
        
    cursor.execute(query, (user_player_id, feedback_date, feedback_text))
    conn.commit()
    return jsonify({
            'isSuccess': True,
            'message': 'Added Feedback Succesfully',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200        