from flask import request, jsonify
from datetime import datetime
from db import get_db_connection 

def get_dailytask():
    searchString = request.args.get('searchString')
    pageNo = int(request.args.get('pageNo', 1))
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    pageSize = 15
    offset = (pageNo - 1) * pageSize


    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Base query
    query = """
        SELECT dt.*, dtt.typeName FROM dailytask dt
        INNER JOIN dailytasktype dtt on dtt.id = dt.taskTypeId
        WHERE 1 = 1
    """
    values = []

    # Add search filter
    if searchString:
        query += " AND (dtt.typeName LIKE %s)"
        likePattern = f"%{searchString}%"
        values.extend([likePattern])
    # Add date range filter
    if startDate and endDate:
        try:
            # Validate dates
            start_date = datetime.strptime(startDate, '%Y-%m-%d')
            end_date = datetime.strptime(endDate, '%Y-%m-%d')
            query += " AND dt.taskDate BETWEEN %s AND %s"
            values.extend([start_date, end_date])
        except ValueError:
            return jsonify({
                'isSuccess': False,
                'message': 'Invalid date format. Expected YYYY-MM-DD.',
                'data': [],
                'totalCount': 0
            }), 400

    # Add ordering, limit, and offset
    query += """
        ORDER BY dt.taskDate DESC
        LIMIT %s OFFSET %s
    """
    values.extend([pageSize, offset])

    # Execute query
    cursor.execute(query, tuple(values))
    tasks = cursor.fetchall()

    # Count total entries for pagination
    count_query = """
        SELECT COUNT(*) AS total
        FROM dailytask dt
        INNER JOIN dailytasktype dtt on dtt.id = dt.taskTypeId
        WHERE 1 = 1
    """
    count_values = []

    if searchString:
        count_query += " AND (dtt.typeName LIKE %s)"
        count_values.extend([likePattern])
    
    if startDate and endDate:
        count_query += " AND dt.taskDate BETWEEN %s AND %s"
        count_values.extend([start_date, end_date])

    cursor.execute(count_query, tuple(count_values))
    total_count = cursor.fetchone()['total']

    # Close database connection
    cursor.close()
    conn.close()

    if not tasks:
        return jsonify({
            'isSuccess': True,
            'message': 'No daily task found',
            'data': [],
            'totalCount': 0
        }), 200

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully retrieved daily task',
        'data': tasks,
        'totalCount': total_count
    }), 200

def get_DailyTaskType():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM dailytasktype"
    cursor.execute(query)
    dailyTaskTypes = cursor.fetchall()
    if not dailyTaskTypes:
        return jsonify({
            'isSuccess': True,
            'message': 'No types found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': dailyTaskTypes,
                'data2': None,
                'totalCount': None 
            }), 200

def save_dailyTask():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Retrieve form data
    task_typeId = int(request.form.get('taskTypeId'))
    task_ID = request.form.get('taskID')
    is_update = task_ID is not None and task_ID != '0'

    if is_update:
        task_ID = int(task_ID)
    else:
        task_ID = None

    reward_Coins = float(request.form.get('rewardCoins'))
    task_Date = request.form.get('taskDate')
    quantity = request.form.get('quantity')

    if is_update:
        # Update the existing dailytask
        sql_content = """
            UPDATE dailytask
            SET rewardCoins = %s, taskDate = %s, taskTypeId = %s, quantity = %s
            WHERE taskID = %s
        """
        cursor.execute(sql_content, (
            reward_Coins,
            task_Date,
            task_typeId,
            quantity,
            task_ID
        ))

    else:
        # Insert a new dailytask
        sql_content = """
            INSERT INTO dailytask (rewardCoins, taskDate, taskTypeId, quantity)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql_content, (
            reward_Coins,
            task_Date,
            task_typeId,
            quantity
        ))
        conn.commit()

    conn.commit()
    return jsonify({'isSuccess': True, "message": "Daily Task saved successfully"}), 201
