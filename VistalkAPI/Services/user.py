# user.py
import jwt
from datetime import datetime, timedelta
from db import get_db_connection
from flask import request, jsonify
import hashlib

def generate_token(user_name):
    expiration_time = datetime.utcnow() + timedelta(hours=1)
    token = jwt.encode({
        'sub': user_name,
        'exp': expiration_time
    }, '8807c2bfe813ec02b9178d3c5826118894f3cd01e5d1630555f03d64ee42e655', algorithm='HS256')
    return token

def login():
    email = request.args.get('email')
    password = request.args.get('password')

    if not email or not password:
        return jsonify({
            'isSuccess': False,
            'message': 'Email and password are required',
            'data': None,
            'data2': None,
            'totalCount': None
        }), 200

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT name, encryptedpassword FROM user WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and hash_password(password) == user['encryptedpassword']:
            token = generate_token(user['name'])
            return jsonify({
                'isSuccess': True,
                'message': 'Login successful',
                'data': {
                    'name': user['name'],
                    'token': token
                },
                'data2': None,
                'totalCount': None 
            }), 200
        else:
            return jsonify({
                'isSuccess': False,
                'message': 'Invalid credentials',
                'data': None,
                'data2': None,
                'totalCount': None
            }), 200
    finally:
        cursor.close()
        conn.close()

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

def createVista():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    languageId = data.get('languageId')

    if not email or not password or not name:
        return jsonify({
            'isSuccess': False,
            'message': 'All fields are required',
            'data': None,
            'data2': None,
            'totalCount': None
        }), 200

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Insert into user table
        query = """
        INSERT INTO user (name, email, encryptedPassword, isActive, isAdmin, isPlayer, isAccountLocked) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, email, password, 1, 0, 1, 0))
        conn.commit()
        userId = cursor.lastrowid

        # Insert into vista table
        vistaQuery = """
        INSERT INTO vista (userPlayerId, vCoin, totalScoreWeekly, currentLanguageId) 
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(vistaQuery, (userId, 0, 0, languageId))
        conn.commit()

        # Select unit IDs for the specified language
        sectionQuery = """
        SELECT u.unitId 
        FROM unit u 
        INNER JOIN section s ON s.sectionId = u.sectionID 
        WHERE s.languageID = %s
        """
        cursor.execute(sectionQuery, (languageId,))
        unitIds = cursor.fetchall()

        # Insert into userunit table
        for unit in unitIds:
            userUnitQuery = """
            INSERT INTO userunit (userPlayerId, unitId, totalCorrectAnswers, viStars, totalScore) 
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(userUnitQuery, (userId, unit['unitId'], 0, 0, 0))
        conn.commit()

        # Select item IDs
        itemQuery = """
        SELECT i.itemId 
        FROM powerUp p 
        INNER JOIN item i ON i.itemID = p.itemId
        """
        cursor.execute(itemQuery)
        itemIds = cursor.fetchall()

        # Insert into userItem table
        for item in itemIds:
            userItemQuery = """
            INSERT INTO userItem (userPlayerId, itemId, quantity) 
            VALUES (%s, %s, %s)
            """
            cursor.execute(userItemQuery, (userId, item['itemId'], 0))
        conn.commit()

        return jsonify({'isSuccess': True, "message": "User registered successfully"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'isSuccess': False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()
