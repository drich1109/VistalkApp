from flask import request, jsonify
import json
from db import get_db_connection
from datetime import datetime,date, timedelta
import numpy as np

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
        SELECT dateDaily, score FROM dailyscore
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
            Select p.* from powerup p inner join item i on i.itemID = p.itemID where p.isImplemented = 1 and i.isActive = 1"""
    cursor.execute(query)
    powerUps = cursor.fetchall()

    query2 = """
            Select ui.*, p.name, p.description, i.filePath from useritem ui 
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
                INSERT INTO useritem (userPlayerId, itemId, quantity) 
                VALUES (%s, %s, 0)
            """
            cursor.execute(insert_query, (userID, powerUp['itemID']))
    cursor.execute("""
        Select ui.*, p.name, p.description, i.filePath from useritem ui 
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
    powerUps = request.form.get('powerUps')
    powerUps = json.loads(powerUps) if powerUps else [] 

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
    vCoin = 0

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
        cursor.execute(query_update2, (vCoin, userId))

        update_event_logs(userId, powerUps, totalScore)
        
    for powerUp in powerUps:
        itemId = powerUp.get('itemId')
        quantity = powerUp.get('quantity')

        
        selectUserPowerUp = """
            SELECT * FROM useritem WHERE userPlayerId = %s AND itemId = %s
        """
        cursor.execute(selectUserPowerUp, (userId, itemId))
        
        
        powerUpUser = cursor.fetchone()
        if powerUpUser is None:
            
            print(f"No record found for userId {userId} and itemId {itemId}.")
            continue  
        print(powerUpUser)
        currentQuantity = powerUpUser[3]
        print(currentQuantity)
        
        toDeduct = int(currentQuantity) - int(quantity)
        print(quantity)

        
        query_update_powerup = """
            UPDATE useritem 
            SET quantity = quantity - %s 
            WHERE userPlayerId = %s AND itemId = %s
        """
        cursor.execute(query_update_powerup, (toDeduct, userId, itemId))

        query_next_unit = """
            SELECT unitID FROM unit
            WHERE sectionID = (SELECT sectionID FROM unit WHERE unitID = %s) 
            AND unitNumber = (SELECT unitNumber + 1 FROM unit WHERE unitID = %s)
        """
        cursor.execute(query_next_unit, (unitId, unitId))
        next_unit = cursor.fetchone()

        if next_unit:
            next_unit_id = next_unit[0]
            query_unlock_next_unit = """
                UPDATE userunit SET isLocked = 0 WHERE userPlayerID = %s AND unitID = %s
            """
            cursor.execute(query_unlock_next_unit, (userId, next_unit_id))
            
        conn.commit()
        return jsonify({
            'isSuccess': True,
            'message': 'Saved Successfully',
            'data': vCoin,
            'data2': None,
            'totalCount': 0
        }), 200
    else:
        return jsonify({
            'isSuccess': False,
            'message': 'Current totalScore is greater than or equal to the new totalScore. Update not performed.',
            'data': vCoin,
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
        SELECT u.userId as id, u.name, u.imagePath, 
               (SELECT SUM(score) FROM dailyscore ds 
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
            SELECT id FROM dailyscore 
            WHERE userPlayerId = %s AND dateDaily = %s
        """
    cursor.execute(select_query, (user_player_id, dateNow))
    record = cursor.fetchone()

    if record:
        update_query = """
                UPDATE dailyscore 
                SET score = score + %s 
                WHERE id = %s
            """
        cursor.execute(update_query, (score, record[0]))
    else:
        insert_query = """
                INSERT INTO dailyscore (score, userPlayerId, dateDaily) 
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
        SELECT 
            RANK() OVER (ORDER BY COALESCE(totalScoreWeekly, 0) DESC) AS userRank,
            v.userPlayerId AS id,
            u.name,
            u.imagePath,
            COALESCE(totalScoreWeekly, 0) AS totalScoreWeekly
        FROM vista v
        INNER JOIN user u ON u.UserID = v.userPlayerId
        LEFT JOIN (
            SELECT 
                userPlayerId,
                SUM(score) AS totalScoreWeekly
            FROM dailyscore
            WHERE dateDaily BETWEEN %s AND %s
            GROUP BY userPlayerId
        ) ds ON ds.userPlayerId = v.userPlayerId
        WHERE u.userId = %s;
    """
    
    cursor.execute(query, (start_of_week, end_of_week, userId))
    vista = cursor.fetchone()

    if not vista:
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
        'data': vista,
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

def getLeaderBoardsAllTime():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT u.userId as id, u.name, u.imagePath, 
               (SELECT SUM(score) FROM dailyscore ds 
                WHERE ds.userPlayerId = v.userPlayerID) as totalScoreWeekly 
        FROM vista v 
        INNER JOIN user u ON u.UserID = v.userPlayerID 
        WHERE u.isPlayer = 1 AND u.isActive = 1 
        GROUP BY u.userId, u.name, u.imagePath
        ORDER BY totalScoreWeekly DESC
        LIMIT 10
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

def getSelfRankAllTime():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    userId = request.args.get('userId')
    
    query = """   
        SELECT 
            RANK() OVER (ORDER BY COALESCE(totalScoreWeekly, 0) DESC) AS userRank,
            v.userPlayerId AS id,
            u.name,
            u.imagePath,
            COALESCE(totalScoreWeekly, 0) AS totalScoreWeekly
        FROM vista v
        INNER JOIN user u ON u.UserID = v.userPlayerId
        LEFT JOIN (
            SELECT 
                userPlayerId,
                SUM(score) AS totalScoreWeekly
            FROM dailyscore
            GROUP BY userPlayerId
        ) ds ON ds.userPlayerId = v.userPlayerId
        WHERE u.userId = %s;
    """
    
    cursor.execute(query, (userId,))
    vista = cursor.fetchone()

    if not vista:
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
        'data': vista,
        'data2': None,
        'totalCount': None 
    }), 200

def update_event_logs(userId, powerUps, totalScore):
    today = date.today()
    
    conn = get_db_connection()
    cursor = conn.cursor()

    
    query_fetch_event_logs = """
        SELECT dt.powerUpId, dt.taskTypeId, dt.taskId, el.currentValue
        FROM eventlogs el
        INNER JOIN dailytask dt ON el.dailyTaskId = dt.taskId
        inner join playerdailytask pdt on pdt.taskID = dt.taskId
        WHERE el.eventDate = %s AND el.userPlayerId = %s and pdt.isCompleted = 0
    """
    cursor.execute(query_fetch_event_logs, (today, userId))
    event_logs = cursor.fetchall()

    
    query_fetch_daily_tasks = """
        SELECT pdt.taskId, dt.quantity as requiredQuantity 
        FROM playerdailytask pdt
        INNER JOIN dailytask dt ON pdt.taskId = dt.taskId
        WHERE pdt.userPlayerId = %s AND dt.taskDate = %s
    """
    cursor.execute(query_fetch_daily_tasks, (userId, today))
    daily_tasks = cursor.fetchall()  

    
    for event_log in event_logs:
        powerUpId = event_log[0]
        taskTypeId = event_log[1]
        taskId = event_log[2]
        currentValue = event_log[3]

        if taskTypeId == 1:
            
            query_update_task_type_1 = """
                UPDATE eventlogs
                SET currentValue = currentValue + 1
                WHERE userPlayerId = %s AND dailyTaskId = %s AND eventDate = %s
            """
            cursor.execute(query_update_task_type_1, (userId, taskId, today))

        elif taskTypeId == 2:
            current_quantity_query = """
                SELECT quantity FROM useritem WHERE userPlayerID = %s AND itemId = %s
            """
            cursor.execute(current_quantity_query, (userId, powerUpId))
            current_quantity = cursor.fetchone()
            print(current_quantity)
            if current_quantity is not None:
                current_quantity = current_quantity[0]
                print(powerUps)

                for powerUp in powerUps:
                    if powerUp['itemId'] == powerUpId:
                        usage_to_subtract = powerUp['quantity']
                        
                        new_quantity = current_quantity - usage_to_subtract
                        print(new_quantity)
                        
                        query_update_task_type_2 = """
                            UPDATE eventlogs
                            SET currentValue = currentValue + %s
                            WHERE userPlayerId = %s AND dailyTaskId = %s AND eventDate = %s
                        """
                        cursor.execute(query_update_task_type_2, (new_quantity, userId, taskId, today))

        elif taskTypeId == 5:
            
            query_update_task_type_5 = """
                UPDATE eventlogs
                SET currentValue = currentValue + %s
                WHERE userPlayerId = %s AND dailyTaskId = %s AND eventDate = %s
            """
            cursor.execute(query_update_task_type_5, (totalScore, userId, taskId, today))

        
        query_refetch_current_value = """
            SELECT currentValue FROM eventlogs
            WHERE userPlayerId = %s AND dailyTaskId = %s AND eventDate = %s
        """
        cursor.execute(query_refetch_current_value, (userId, taskId, today))
        updated_current_value = cursor.fetchone()
        if updated_current_value is not None:
            currentValue = updated_current_value[0]

        
        for daily_task in daily_tasks:
            daily_task_id = daily_task[0]
            required_quantity = daily_task[1]

            
            if taskId == daily_task_id and currentValue >= required_quantity:
                
                query_update_daily_task = """
                    UPDATE playerdailytask
                    SET isCompleted = 1
                    WHERE userPlayerId = %s AND taskId = %s
                """
                cursor.execute(query_update_daily_task, (userId, daily_task_id))

                
                query_insert_message = """
                    INSERT INTO notifications (userPlayerId, message, isOpened)
                    VALUES (%s, %s, %s)
                """
                notification_message = f"You completed a task! You may now claim your price in the daily task board."
                cursor.execute(query_insert_message, (userId, notification_message, 0))

    conn.commit()
    cursor.close()

def get_notifications():
    userId = request.args.get('userId')
    print(userId)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query_fetch_notifications = """
        SELECT id, message, isOpened
        FROM notifications
        WHERE userPlayerId = %s
        ORDER BY (CASE WHEN isOpened = 0 THEN 0 ELSE 1 END), id DESC
        LIMIT 5
    """
    cursor.execute(query_fetch_notifications, (userId,))
    notifications = cursor.fetchall()

    query_count_unopened = """
        SELECT COUNT(*) AS unopened_count
        FROM notifications
        WHERE userPlayerId = %s AND isOpened = 0
    """
    cursor.execute(query_count_unopened, (userId,))
    count_unopened = cursor.fetchone().get('unopened_count', 0)

    return jsonify({
            'isSuccess': True,
            'message': 'No sections found',
            'data': notifications,
            'data2': None,
            'totalCount': count_unopened
    }), 200

def claim_reward():
    userId = request.json.get('userId')  
    taskId = request.json.get('taskId')
    
    conn = get_db_connection()
    cursor = conn.cursor()

    query_fetch_reward = """
        SELECT rewardCoins FROM dailytask WHERE taskId = %s
    """
    cursor.execute(query_fetch_reward, (taskId,))
    reward = cursor.fetchone()

    if reward is None:
        cursor.close()
        conn.close()
        return jsonify({
                'isSuccess': False,
                'message': 'No sections found',
                'data': [],
                'data2': None,
                'totalCount': 0
        }), 200
    reward_amount = reward[0]

    query_update_player_daily_task = """
        UPDATE playerdailytask
        SET isClaimed = 1
        WHERE userPlayerId = %s AND taskId = %s
    """
    cursor.execute(query_update_player_daily_task, (userId, taskId))

    query_update_vista = """
        UPDATE vista
        SET vcoin = vcoin + %s
        WHERE userPlayerId = %s
    """
    cursor.execute(query_update_vista, (reward_amount, userId))

    conn.commit()

    return jsonify({
            'isSuccess': True,
            'message': 'No sections found',
            'data': [],
            'data2': None,
            'totalCount': 0
    }), 200

def updateNotifications():
    userId = request.json.get('userId')
    print(f"Updating notifications for userId: {userId}")
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    
    query_fetch_notifications = """
        SELECT id, message, isOpened
        FROM notifications
        WHERE userPlayerId = %s AND isOpened = 0
    """
    cursor.execute(query_fetch_notifications, (userId,))
    notifications = cursor.fetchall()

    if not notifications:
        return jsonify({
            'isSuccess': True,
            'message': 'No unopened notifications to update.',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200

    
    try:
        for notification in notifications:
            notification_id = notification['id']
            query_update_notification = """
                UPDATE notifications
                SET isOpened = 1
                WHERE id = %s
            """
            cursor.execute(query_update_notification, (notification_id,))
        
        conn.commit()  

        print(f"Number of notifications updated: {len(notifications)}")

        return jsonify({
            'isSuccess': True,
            'message': 'Notifications updated successfully',
            'data': notifications,  
            'data2': None,
            'totalCount': len(notifications)  
        }), 200

    except Exception as e:
        print(f"Error occurred while updating notifications: {e}")
        return jsonify({'isSuccess': False, 'message': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

def check_subscription_and_update(userId):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT isPremium, premiumExpiry, numberPronounced 
        FROM vista 
        WHERE userPlayerId = %s
    """
    cursor.execute(query, (userId,))
    result = cursor.fetchone()
    
    if result:
        if result['premiumExpiry']:
            expiry_date = result['premiumExpiry']
            current_date = datetime.now()

            if expiry_date < current_date:
                update_query = """
                    UPDATE vista 
                    SET isPremium = 0, premiumExpiry = NULL, numberPronounced = 20 
                    WHERE userPlayerId = %s
                """
                cursor.execute(update_query, (userId,))
                
                query_insert_message = """
                        INSERT INTO notifications (userPlayerId, message, isOpened)
                        VALUES (%s, %s, %s)
                    """
                message = "Your subscription has ended. Please renew to continue enjoying our services."
                cursor.execute(query_insert_message, (userId, message, 0))

                conn.commit()
                print(f"User {userId}'s subscription has expired. Values have been reset.")
                
            else:
                print(f"User {userId}'s subscription is still active.")
        
        if result['numberPronounced'] is None or result['numberPronounced'] <= 0:
            print(f"User {userId}'s numberPronounced is either None or <= 0.")
    
    else:
        print(f"User {userId} not found.")

def check_all_users_subscriptions():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT userPlayerId FROM vista
    """
    cursor.execute(query)
    users = cursor.fetchall()

    for user in users:
        userId = user['userPlayerId']
        check_subscription_and_update(userId)

def updateUserLanguage():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    userId = data.get('userId')
    languageId = data.get('languageId')

    # Update the user's current language
    query = """
        UPDATE vista SET currentLanguageId = %s WHERE userPlayerId = %s
    """
    cursor.execute(query, (languageId, userId))
    conn.commit()

    # Fetch all units associated with the selected language
    sectionQuery = """
        SELECT u.unitId, u.unitNumber
        FROM unit u 
        INNER JOIN section s ON s.sectionId = u.sectionID 
        WHERE s.languageID = %s AND u.isActive = 1
    """
    cursor.execute(sectionQuery, (languageId,))
    unitIds = cursor.fetchall()

    # Fetch all units already assigned to the user
    userUnitQuery = """
        SELECT unitID FROM userunit WHERE userPlayerID = %s
    """
    cursor.execute(userUnitQuery, (userId,))
    userUnits = cursor.fetchall()

    # Extract unit IDs already assigned to the user
    assignedUnitIds = {unit['unitID'] for unit in userUnits}

    # Insert units into userunit if not already assigned
    for unit in unitIds:
        if unit['unitId'] not in assignedUnitIds:
            isLocked = 0 if unit['unitNumber'] == 1 else 1
            insertQuery = """
                INSERT INTO userunit (userPlayerId, unitId, totalCorrectAnswers, totalScore, isLocked) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(insertQuery, (userId, unit['unitId'], 0, 0, isLocked))
    conn.commit()

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully Retrieved',
        'data': None,
        'data2': None,
        'totalCount': None
    }), 200
