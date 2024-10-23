from flask import request, jsonify, send_from_directory
from db import UserImages, get_db_connection
from datetime import datetime,date, timedelta
import numpy as np

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

    
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())  
    end_of_week = start_of_week + timedelta(days=6)  

    
    query = """SELECT u.UserID as id, u.name, u.email, u.imagePath, v.vCoin, v.currentLanguageId, 
                        v.vcoin, v.isPremium as isSubscribed, v.premiumExpiry as expirationDate,
                      (SELECT COUNT(*) FROM userunit uu 
                       INNER JOIN user u ON u.userId = uu.userPlayerID
                       WHERE u.isActive = true AND u.isPlayer = true AND u.userID = %s AND uu.isLocked = false) unitsUnlocked,
                      (SELECT MAX(totalScore) FROM userunit uu  
                       INNER JOIN user u ON u.userId = uu.userPlayerID
                       WHERE u.isActive = true AND u.isPlayer = true AND u.userID = %s AND uu.isLocked = false) highestScore
               FROM user u 
               INNER JOIN vista v ON u.userID = v.userPlayerID 
               WHERE u.isActive = true AND u.isPlayer = true AND u.userID = %s"""
    values = [userID, userID, userID]
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

    
    score_query = """
        SELECT dateDaily, score FROM dailyScore
        WHERE userPlayerId = %s AND dateDaily BETWEEN %s AND %s
        ORDER BY dateDaily ASC
    """
    cursor.execute(score_query, (userID, start_of_week, end_of_week))
    weekly_scores = cursor.fetchall()

    
    week_scores = { (start_of_week + timedelta(days=i)).strftime("%A"): 0 for i in range(7) }
    total_weekly_score = 0
    
    for record in weekly_scores:
        day_name = record['dateDaily'].strftime("%A")  
        week_scores[day_name] = record['score']
        total_weekly_score += record['score'] 

    userProfile['weeklyScoreGraph'] = week_scores
    userProfile['totalWeeklyScore'] = total_weekly_score

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
            cursor.execute(insert_query, (userID, powerUp['itemID']))
    cursor.execute("""
        Select ui.*, p.name, p.description, i.filePath from userItem ui 
        inner join item i on i.itemId = ui.itemId 
        inner join powerup p on p.itemId = i.itemId 
        Where isActive = 1 and p.IsImplemented = 1 and i.itemTypeId = 1 and userPlayerId = %s
    """, [userID])
    return cursor.fetchall()

def add_report():
    data = request.json
    user_player_id = data.get('userId') 
    report_text = data.get('report')
    print(user_player_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    report_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    query = """
            INSERT INTO userreport (userPlayerID, reportDate, reportText)
            VALUES (%s, %s, %s)
        """
        
    cursor.execute(query, (user_player_id, report_date, report_text))
    conn.commit()
    return jsonify({
            'isSuccess': True,
            'message': 'Added Report Succesfully',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200

def saveGamePlay():
    data = request.form
    userId = int(data.get('userId'))
    unitId = int(data.get('unitId'))
    totalCorrectAnswer = int(data.get('totalCorrectAnswer'))
    totalScore = int(data.get('totalScore')) 

    conn = get_db_connection()
    cursor = conn.cursor()

    query_select = """
        SELECT totalScore FROM userunit WHERE userPlayerID = %s AND unitID = %s
    """

    cursor.execute(query_select, (userId, unitId))
    current_total_score = cursor.fetchone()

    if current_total_score is None:
        return jsonify({
            'isSuccess': False,
            'message': 'User or Unit not found.',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 404

    existing_total_score = current_total_score[0]

    if totalScore > existing_total_score:
        dailyScore(userId, totalScore)

        query_update = """
            UPDATE userunit SET totalCorrectAnswers = %s, totalScore = %s WHERE userPlayerID = %s AND unitID = %s
        """
        cursor.execute(query_update, (totalCorrectAnswer, totalScore, userId, unitId))

        query_select2 = """
            SELECT totalItems FROM unit WHERE unitID = %s
        """

        cursor.execute(query_select2, (unitId, ))
        totalItems = cursor.fetchone()[0]

        totalPercentage = (totalCorrectAnswer / totalItems) * 100

        vCoin = 0
        if totalPercentage <= 70:
            vCoin = np.random.randint(10, 20)
        elif 71 <= totalPercentage <= 90:
            vCoin = np.random.randint(21, 30)
        elif 91 <= totalPercentage <= 99:
            vCoin = np.random.randint(31, 45)
        elif totalPercentage == 100:
            vCoin = 50
        else:
            vCoin = 0

        query_update2 = """
            UPDATE vista 
            SET vCoin = vCoin + %s 
            WHERE userPlayerID = %s
        """
        cursor.execute(query_update2, (totalScore, vCoin, userId))

        conn.commit()
        return jsonify({
            'isSuccess': True,
            'message': 'Saved Successfully',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    else:
        return jsonify({
            'isSuccess': False,
            'message': 'Current totalScore is greater than or equal to the new totalScore. Update not performed.',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    
def getLeaderBoards():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

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


def dailyScore(user_player_id, score):
    dateNow = date.today()
    conn = get_db_connection()
    cursor = conn.cursor()

    select_query = """
            SELECT id FROM dailyScore 
            WHERE userPlayerId = %s AND dateDaily = %s
        """
    cursor.execute(select_query, (user_player_id, dateNow))
    record = cursor.fetchone()

    if record:
        update_query = """
                UPDATE dailyScore 
                SET score = score + %s 
                WHERE id = %s
            """
        cursor.execute(update_query, (score, record[0]))
    else:
        insert_query = """
                INSERT INTO dailyScore (score, userPlayerId, dateDaily) 
                VALUES (%s, %s, %s)
            """
        cursor.execute(insert_query, (score, user_player_id, dateNow))

    conn.commit()

    return jsonify({
            'isSuccess': True,
            'message': 'Updated Succesfully',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200

def updateDailyScore():
    data = request.json
    user_player_id = data.get('userId') 
    score = data.get('score')
    result = dailyScore(user_player_id, score)
    return result
    
def getSelfRank():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    userId = request.args.get('userId')
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())  
    end_of_week = start_of_week + timedelta(days=6)
    
    query = """
        SELECT RANK() OVER (ORDER BY SUM(ds.score) DESC) AS userRank
            FROM vista v 
            INNER JOIN user u ON u.UserID = v.userPlayerID 
            INNER JOIN dailyScore ds ON ds.userPlayerId = v.userPlayerID 
            WHERE u.userId = %s 
            AND ds.dateDaily BETWEEN %s AND %s;
    """
    
    cursor.execute(query, (userId, start_of_week, end_of_week))
    rank = cursor.fetchall()

    if not rank:
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
        'data': rank,
        'data2': None,
        'totalCount': None 
    }), 200

def addRating():
    data = request.json
    user_player_id = data.get('userId') 
    rating = data.get('rating')
    conn = get_db_connection()
    cursor = conn.cursor()
    feedback_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    query = """
            INSERT INTO rating (userPlayerID, rating, ratingDate)
            VALUES (%s, %s, %s)
        """
        
    cursor.execute(query, (user_player_id, rating, feedback_date))
    conn.commit()
    return jsonify({
            'isSuccess': True,
            'message': 'Added Feedback Succesfully',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200