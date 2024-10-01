from flask import request, jsonify, send_from_directory
from db import UserImages, get_db_connection, ItemImage
from datetime import datetime


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
                where i.itemTypeId = true and i.isActive = true"""
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