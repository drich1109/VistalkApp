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
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT name, encryptedpassword FROM user WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and hash_password(password) == user['encryptedpassword']:
            token = generate_token(user['name'])
            return jsonify({
                'name': user['name'],
                'token': token
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    finally:
        cursor.close()
        conn.close()

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()