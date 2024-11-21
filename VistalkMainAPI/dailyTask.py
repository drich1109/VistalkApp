from db import get_db_connection
from flask import request, jsonify
from datetime import date

def getDailyTasks():
    userId = request.args.get('userId')
    dateToday = date.today() 
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """SELECT pdt.*, dt.rewardcoins, dt.tasktypeId, dtt.typeName as taskName, dt.taskDate,pdt.userplayerID, dtt.description as taskDescription, dt.quantity as totalValue, el.currentValue
               FROM eventlogs el
				INNER JOIN playerdailytask pdt on el.dailyTaskid = pdt.taskID
               INNER JOIN dailytask dt ON dt.taskId = pdt.taskId 
               INNER JOIN dailytasktype dtt ON dtt.id = dt.tasktypeId
               WHERE el.userplayerID = %s and pdt.userPlayerId = %s AND dt.taskDate = %s and el.eventDate = %s AND dtt.isImplemented = 1;"""
    values = (userId, userId, dateToday, dateToday)
    cursor.execute(query, values)
    tasks = cursor.fetchall()

    if not tasks:
        return jsonify({
            'isSuccess': True,
            'message': 'No tasks found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    
    return jsonify({
        'isSuccess': True,
        'message': 'Successfully Retrieved',
        'data': tasks,
        'data2': None,
        'totalCount': None
    }), 200