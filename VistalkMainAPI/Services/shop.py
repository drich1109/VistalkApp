from flask import request, jsonify, send_from_directory
from db import UserImages, get_db_connection, ItemImage, BackGroundMusicDirectory
from datetime import datetime, timedelta

def getItemImage():
    fileName = request.args.get('fileName')
    timestamp = request.args.get('t')
    try:
        return send_from_directory(ItemImage, fileName)
    except FileNotFoundError:
        return None

def getPowerUps():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """Select i.*, p.name, p.description from item i inner join powerup p on p.itemId = i.ItemId
                where i.itemTypeId = 1 and i.isActive = true"""
    cursor.execute(query)
    powerUps = cursor.fetchall()
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
                'data': powerUps,
                'data2': None,
                'totalCount': None 
            }), 200

def getUserVcoin():
    user_player_id = request.args.get('userId') 
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
            SELECT vCoin FROM vista where userPLayerId = %s;
        """ 
    cursor.execute(query, (user_player_id,))
    result = cursor.fetchone()
    if result:
        vCoin = result[0] 
        return jsonify({
            'isSuccess': True,
            'message': 'Fetched vCoin successfully',
            'data': vCoin,  
            'totalCount': 1
        }), 200
    else:
        return jsonify({
            'isSuccess': False,
            'message': 'No vCoin found for user',
            'data': None,
            'totalCount': 0
        }), 404
    
def buyPowerUp():
    data = request.get_json()  
    user_player_id = data.get('userId')  
    itemID = data.get('itemId') 
    quantity = data.get('quantity') 
    if not all([quantity, itemID, user_player_id]):
        return jsonify({
            'isSuccess': False,
            'message': 'Missing parameters',
            'data': None,
            'totalCount': 0
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    queryPrice = """SELECT vcoinPrice FROM item WHERE itemID = %s"""
    cursor.execute(queryPrice, (itemID,))
    result = cursor.fetchone()

    if not result:
        return jsonify({
            'isSuccess': False,
            'message': 'Item not found',
            'data': None,
            'totalCount': 0
        }), 404

    price = result[0]
    total_cost = price * quantity

    vCoinQuery = """SELECT vCoin FROM vista WHERE userPlayerId = %s"""
    cursor.execute(vCoinQuery, (user_player_id,))
    vCoinResult = cursor.fetchone()

    if not vCoinResult or vCoinResult[0] < total_cost:
        return jsonify({
            'isSuccess': False,
            'message': 'Insufficient vCoins',
            'data': None,
            'totalCount': 0
        }), 400

    updateUserItemQuery = """
        UPDATE useritem SET quantity = quantity + %s 
        WHERE userPlayerId = %s AND itemID = %s
    """
    cursor.execute(updateUserItemQuery, (quantity, user_player_id, itemID))

    updateVCoinQuery = """
        UPDATE vista SET vCoin = vCoin - %s WHERE userPlayerId = %s
    """
    cursor.execute(updateVCoinQuery, (total_cost, user_player_id))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully bought the item',
        'data': None,
        'totalCount': 0
    }), 200

def getSubscriptions():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """Select * from subscription"""
    cursor.execute(query)
    subscriptions = cursor.fetchall()
    if not subscriptions:
        return jsonify({
            'isSuccess': True,
            'message': 'No subscriptions found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': subscriptions,
                'data2': None,
                'totalCount': None 
            }), 200

def buySubscription():
    data = request.get_json()  
    user_player_id = data.get('userId')  
    subscription_id = data.get('subscriptionId') 
    
    if not all([subscription_id, user_player_id]):
        return jsonify({
            'isSuccess': False,
            'message': 'Missing parameters',
            'data': None,
            'totalCount': 0
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    query_subscription = """SELECT price, noOfDays FROM subscription WHERE id = %s"""
    cursor.execute(query_subscription, (subscription_id,))
    subscription_result = cursor.fetchone()

    if not subscription_result:
        return jsonify({
            'isSuccess': False,
            'message': 'Subscription not found',
            'data': None,
            'totalCount': 0
        }), 404

    subscription_amount = subscription_result[0]  
    subscription_days = subscription_result[1]    

    transaction_date = datetime.now()  
    insert_transaction_query = """
        INSERT INTO cointransaction (userPlayerId, subscriptionId, transactionDate, amountPaid)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(insert_transaction_query, (user_player_id, subscription_id, transaction_date, subscription_amount))
    
    premium_expiry_date = transaction_date + timedelta(days=subscription_days)
    
    updateVCoinQuery = """
        UPDATE vista SET isPremium = true, premiumExpiry = %s WHERE userPlayerId = %s
    """
    cursor.execute(updateVCoinQuery, (premium_expiry_date, user_player_id))

    conn.commit()
    
    cursor.close()
    conn.close()

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully bought the subscription',
        'data': None,
        'totalCount': 0
    }), 200

def getCoinBags():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """SELECT * FROM vistalkdb.coinbag where isActive = 1"""
    cursor.execute(query)
    coinBags = cursor.fetchall()
    if not coinBags:
        return jsonify({
            'isSuccess': True,
            'message': 'No coinBags found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': coinBags,
                'data2': None,
                'totalCount': None 
            }), 200

def buyCoinBag():
    data = request.get_json()  
    user_player_id = data.get('userId')  
    coinBagId = data.get('coinBagId') 
    
    if not all([coinBagId, user_player_id]):
        return jsonify({
            'isSuccess': False,
            'message': 'Missing parameters',
            'data': None,
            'totalCount': 0
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()
  
    query_coin_bag = """SELECT quantity, moneyPrice FROM coinBag WHERE coinBagId = %s"""
    cursor.execute(query_coin_bag, (coinBagId,))
    coinBag = cursor.fetchone()

    if not coinBag:
        return jsonify({
            'isSuccess': False,
            'message': 'Coin Bag not found',
            'data': None,
            'totalCount': 0
        }), 404

    quantity = coinBag[0]  
    amount = coinBag[1]  
    
    transaction_date = datetime.now()  
    insert_transaction_query = """
        INSERT INTO cointransaction (userPlayerId, coinBagId, transactionDate, amountPaid)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(insert_transaction_query, (user_player_id, coinBagId, transaction_date, amount))
    
    query_vCoin = """SELECT vCoin FROM vista WHERE userPlayerId = %s"""
    cursor.execute(query_vCoin, (user_player_id,))
    vCoin_result = cursor.fetchone()

    if not vCoin_result:
        return jsonify({
            'isSuccess': False,
            'message': 'User not found',
            'data': None,
            'totalCount': 0
        }), 404

    current_vCoin = vCoin_result[0]

    new_vCoin_balance = current_vCoin + quantity
    updateVCoinQuery = """
        UPDATE vista SET vCoin = %s WHERE userPlayerId = %s
    """
    cursor.execute(updateVCoinQuery, (new_vCoin_balance, user_player_id))
    
    conn.commit()
    
    cursor.close()
    conn.close()

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully bought the coinBag',
        'data': None,
        'totalCount': 0
    }), 200

def getMusic():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """SELECT 
                i.*, 
                b.musicTitle, 
                b.musicGenre, 
                CASE 
                    WHEN ui.itemId IS NOT NULL THEN true 
                    ELSE false 
                END AS isAlreadyBought
            FROM item i
            INNER JOIN backgroundmusic b ON b.itemId = i.itemId
            LEFT JOIN useritem ui ON ui.itemId = i.itemId
            WHERE i.itemTypeId = 2 
            AND i.isActive = true"""
    cursor.execute(query)
    music = cursor.fetchall()
    if not music:
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
                'data': music,
                'data2': None,
                'totalCount': None 
            }), 200

def buyMusic():
    data = request.get_json()  
    user_player_id = data.get('userId')  
    itemID = data.get('itemId') 
    quantity = data.get('quantity') 
    if not all([quantity, itemID, user_player_id]):
        return jsonify({
            'isSuccess': False,
            'message': 'Missing parameters',
            'data': None,
            'totalCount': 0
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    queryPrice = """SELECT vcoinPrice FROM item WHERE itemID = %s"""
    cursor.execute(queryPrice, (itemID,))
    result = cursor.fetchone()

    if not result:
        return jsonify({
            'isSuccess': False,
            'message': 'Item not found',
            'data': None,
            'totalCount': 0
        }), 404

    price = result[0]

    vCoinQuery = """SELECT vCoin FROM vista WHERE userPlayerId = %s"""
    cursor.execute(vCoinQuery, (user_player_id,))
    vCoinResult = cursor.fetchone()

    if not vCoinResult or vCoinResult[0] < price:
        return jsonify({
            'isSuccess': False,
            'message': 'Insufficient vCoins',
            'data': None,
            'totalCount': 0
        }), 400

    updateUserItemQuery = """
        INSERT INTO useritem (userPlayerId, itemId, quantity)
        VALUES (%s, %s, %s)
    """
    cursor.execute(updateUserItemQuery, (user_player_id, itemID, quantity))

    updateVCoinQuery = """
        UPDATE vista SET vCoin = vCoin - %s WHERE userPlayerId = %s
    """
    cursor.execute(updateVCoinQuery, (price, user_player_id))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        'isSuccess': True,
        'message': 'Successfully bought the item',
        'data': None,
        'totalCount': 0
    }), 200


def getBackgroundMusic():
    fileName = request.args.get('fileName')
    timestamp = request.args.get('t')
    try:
        return send_from_directory(BackGroundMusicDirectory, fileName)
    except FileNotFoundError:
        return None

