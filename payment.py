import requests
from flask import request, jsonify
import hmac
import hashlib
from datetime import datetime
from db import get_db_connection

def paymongoredirect():
    try:
        data = request.json
        amount = data.get('amount')
        description = data.get('description')
        amount_in_cents = int(float(amount) * 100)
        url = "https://api.paymongo.com/v1/links"

        payload = { "data": { "attributes": {
            "amount": amount_in_cents,
            "description": description,
            "remarks": "test"
        } } }

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Basic c2tfdGVzdF9nS1hlWVh0UlREZTR4Nkd1aWY5Rnk0UjM6"
        }

        response = requests.post(url, json=payload, headers=headers)
        print(response.reason)

        if response.status_code == 200:
            response_data = response.json()
            checkout_url = response_data['data']['attributes']['checkout_url']

            return jsonify({"url": checkout_url}), 200
        else:
            return jsonify({"error": "Failed to create payment link"}), 500

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred"}), 500

def handle_webhook():
    try:

        data = request.json
        description = data['data']['attributes']['data']['attributes']['description']
        event_type = data['data']['attributes']['type']
        user_email = data['data']['attributes']['data']['attributes']['billing']['email']
        connection = get_db_connection()
        cursor = connection.cursor()
        if 'Subscription' in description:
            if event_type == "payment.paid":                
                sql_query = """SELECT userID FROM user WHERE email = %s"""
                cursor.execute(sql_query, (user_email,))
                user_id = cursor.fetchone()
                print(user_id)
                if user_id:
                    user_id = user_id[0]  
                    print(user_id)

                    update_query = """
                        UPDATE vista
                        SET isPremium = 1, premiumDate = %s
                        WHERE userPlayerId = %s
                    """
                    cursor.execute(update_query, (datetime.now(), user_id))
                    connection.commit()
                
                return jsonify({"message": "Webhook handled successfully"}), 200
            else:
                return jsonify({"message": "Event not handled"}), 200
        elif 'Bag' in description:
            if event_type == "payment.paid":
                coinBag_query = """SELECT quantity from coinbag where coinBagName = %s"""
                cursor.execute(coinBag_query, (description,))
                coinBag = cursor.fetchone()
                sql_query = """SELECT userID FROM user WHERE email = %s"""
                cursor.execute(sql_query, (user_email,))
                user_id = cursor.fetchone()
                if user_id:
                    user_id = user_id[0]  
                    print(user_id)

                    update_query = """
                        UPDATE vista
                        SET vCoin = vCoin + %s
                        WHERE userPlayerId = %s
                    """
                    cursor.execute(update_query, (coinBag[0], user_id))
                    connection.commit()
                
                return jsonify({"message": "Webhook handled successfully"}), 200
            else:
                return jsonify({"message": "Event not handled"}), 200
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred"}), 500
    
def poolSubscription():
    userId = request.args.get('userId')
    connection = get_db_connection()
    cursor = connection.cursor()
    sql_query = """SELECT isPremium, premiumDate FROM vista WHERE userPlayerId = %s"""
    cursor.execute(sql_query, (userId,))

        
    result = cursor.fetchone()

        
    if result:
        is_premium, premium_date = result

            
        if is_premium and premium_date and premium_date >= datetime.now().date():
            return jsonify({
            'isSuccess': True,
            'message': 'Subscribed',
            'data': True,
            'data2': None,
            'totalCount': 0
        }), 200
        else:
            return jsonify({
            'isSuccess': True,
            'message': 'Not Subscribed',
            'data': False,
            'data2': None,
            'totalCount': 0
        }), 200  
            
def poolCoinBag():
    userId = request.args.get('userId')
    vcoin = request.args.get('vCoin')
    vcoin = int(vcoin)
    connection = get_db_connection()
    cursor = connection.cursor()
    sql_query = """SELECT vCoin FROM vista WHERE userPlayerId = %s"""
    cursor.execute(sql_query, (userId,))
    result = cursor.fetchone()     
    if result:            
        if result[0] > vcoin:
            return jsonify({
                'isSuccess': True,
                'message': 'Vcoin Purchased',
                'data': True,
                'data2': None,
                'totalCount': 0
            }), 200
        else:
            return jsonify({
            'isSuccess': True,
            'message': 'Not yet Purchased',
            'data': False,
            'data2': None,
            'totalCount': 0
        }), 200   
