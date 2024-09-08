# user.py
import jwt
from datetime import datetime, timedelta, timezone
from db import get_db_connection
from flask import request, jsonify
import hashlib
from Services import emailService

def generate_token(user_name):
    expiration_time = datetime.now(timezone.utc) + timedelta(days=1)
    token = jwt.encode({
        'sub': user_name,
        'exp': expiration_time
    }, '8807c2bfe813ec02b9178d3c5826118894f3cd01e5d1630555f03d64ee42e655', algorithm='HS256')
    return token

def login():
    email = request.args.get('email')
    password = request.args.get('hashedPassword')

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
        cursor.execute("SELECT name, encryptedpassword FROM user WHERE email = %s AND isAdmin = true", (email,))
        user = cursor.fetchone()

        if user and password == user['encryptedpassword']:
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

    if is_email_in_use(email):
        return jsonify({
            'isSuccess': False,
            'message': 'Email already in use, please use another email',
            'data': None,
            'data2': None,
            'totalCount': None
        }), 200
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
        INSERT INTO user (name, email, encryptedPassword, isActive, isAdmin, isPlayer, isAccountLocked, failedLogins) 
        VALUES (%s, %s, %s, %s, %s, %s, %s , %s)
        """
        cursor.execute(query, (name, email, hash_password(password), 1, 0, 1, 0, 0))
        conn.commit()
        userId = cursor.lastrowid

        vistaQuery = """
        INSERT INTO vista (userPlayerId, vCoin, totalScoreWeekly, currentLanguageId) 
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(vistaQuery, (userId, 0, 0, languageId))
        conn.commit()

        sectionQuery = """
        SELECT u.unitId 
        FROM unit u 
        INNER JOIN section s ON s.sectionId = u.sectionID 
        WHERE s.languageID = %s
        """
        cursor.execute(sectionQuery, (languageId,))
        unitIds = cursor.fetchall()

        for unit in unitIds:
            userUnitQuery = """
            INSERT INTO userunit (userPlayerId, unitId, totalCorrectAnswers, viStars, totalScore) 
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(userUnitQuery, (userId, unit['unitId'], 0, 0, 0))
        conn.commit()

        itemQuery = """
        SELECT i.itemId 
        FROM powerUp p 
        INNER JOIN item i ON i.itemID = p.itemId
        """
        cursor.execute(itemQuery)
        itemIds = cursor.fetchall()

        for item in itemIds:
            userItemQuery = """
            INSERT INTO userItem (userPlayerId, itemId, quantity) 
            VALUES (%s, %s, %s)
            """
            cursor.execute(userItemQuery, (userId, item['itemId'], 0))
        conn.commit()

        subject = "Welcome to Vistalk"
        message = """
        Maayong Adlaw, Vista!

        Welcome to the Vistalk Family! We're excited to help you learn Visayan. Enjoy the journey with the Vistalk App!

        Daghang Salamat,
        The Vistalk Team
        """
        emailService.send_email(email, subject, message)
        return jsonify({'isSuccess': True, "message": "User registered successfully"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'isSuccess': False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

from datetime import datetime, timedelta

def lock_account(email, conn):
    cursor = conn.cursor()
    lockout_time = datetime.now() + timedelta(days=1)
    cursor.execute("""
        UPDATE user
        SET isAccountLocked = true, 
            logInTimeLockOut = %s,
            failedlogins = 0
        WHERE email = %s
    """, (lockout_time, email))
    conn.commit()
    cursor.close()

def loginVista():
    email = request.args.get('email')
    password = request.args.get('hashedPassword')

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
        cursor.execute("""
            SELECT name, encryptedpassword, failedlogins, isAccountLocked, logInTimeLockOut
            FROM user
            WHERE email = %s AND isPlayer = true AND isActive = true
        """, (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({
                'isSuccess': False,
                'message': 'Invalid credentials',
                'data': None,
                'data2': None,
                'totalCount': None
            }), 200
        
        if user['isAccountLocked']:
            if datetime.now() < user['logInTimeLockOut']:
                return jsonify({
                    'isSuccess': False,
                    'message': 'Your account is locked. Please try again tomorrow.',
                    'data': None,
                    'data2': None,
                    'totalCount': None
                }), 200
            else:
                cursor.execute("""
                    UPDATE user
                    SET isAccountLocked = false, logInTimeLockOut = NULL
                    WHERE email = %s
                """, (email,))
                conn.commit()
        
        if password == user['encryptedpassword']:
            token = generate_token(user['name'])
            cursor.execute("""
                UPDATE user
                SET failedlogins = 0
                WHERE email = %s
            """, (email,))
            conn.commit()
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
            new_failed_logins = user['failedlogins'] + 1
            if new_failed_logins >= 5:
                lock_account(email, conn)
                return jsonify({
                    'isSuccess': False,
                    'message': 'Too many failed login attempts. Your account is locked for one day.',
                    'data': None,
                    'data2': None,
                    'totalCount': None
                }), 200
            else:
                cursor.execute("""
                    UPDATE user
                    SET failedlogins = %s
                    WHERE email = %s
                """, (new_failed_logins, email))
                conn.commit()
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

def is_email_in_use(email):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT email FROM user WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        return result is not None
    except Exception as e:
        return jsonify({'isSuccess': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

def forgotPassword():
    data = request.json
    email = data.get('email')
    hashedPassword = data.get('hashedPassword')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        UPDATE user
        SET encryptedPassword = %s
        WHERE email = %s
    """, (hashedPassword, email))
    conn.commit()
    return jsonify({
                    'isSuccess': True,
                    'message': 'Password Saved Successfully!',
                    'data': None,
                    'data2': None,
                    'totalCount': None
                }), 200
