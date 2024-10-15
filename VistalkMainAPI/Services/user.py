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

def getUserPowerUp():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    userID = request.args.get('userID')

    query = """
            Select * from powerUp where isImplemented = 1"""
    cursor.execute(query)
    powerUps = cursor.fetchall()

    query2 = """
            Select ui.*, p.name, p.description, i.filePath from userItem ui 
            inner join item i on i.itemId = ui.itemId 
            inner join powerup p on p.itemId = i.itemId 
            Where isActive = 1 and p.IsImplemented = 1 and i.itemTypeId = 1 and userPlayerId = %s"""
    values = [userID,]
    cursor.execute(query2, values)
    userPowerUp = cursor.fetchall()
    newUserPowerUp = checkUserPowerUps(cursor, userID, powerUps, userPowerUp)
    conn.commit()
    if not powerUps:
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
        'data': newUserPowerUp,
        'data2':None,
        'totalCount': 1
    }), 200

def checkUserPowerUps(cursor, userID, powerUps, userPowerUps):
    userPowerUpIds = [up['itemId'] for up in userPowerUps]
    for powerUp in powerUps:
        if powerUp['itemID'] not in userPowerUpIds:
            insert_query = """
                INSERT INTO userItem (userPlayerId, itemId, quantity) 
                VALUES (%s, %s, 0)
            """
            cursor.execute(insert_query, (userID, powerUp['itemId']))
    cursor.execute("""
        Select ui.*, p.name, p.description, i.filePath from userItem ui 
        inner join item i on i.itemId = ui.itemId 
        inner join powerup p on p.itemId = i.itemId 
        Where isActive = 1 and p.IsImplemented = 1 and i.itemTypeId = 1 and userPlayerId = %s
    """, [userID])
    
    return cursor.fetchall()
