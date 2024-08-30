from db import get_db_connection
from flask import request, jsonify, send_from_directory
import os

ItemImage = 'C:\\VistalkApp\\VistalkApp\\Item Image'
BackGroundMusicDirectory = 'C:\\VistalkApp\\VistalkApp\\Background Music Files'

def save_item():
    conn = get_db_connection()
    cursor = conn.cursor()
    item_typeId = int(request.form.get('itemTypeID'))
    print(item_typeId)
    if(item_typeId == 1):
        vcoin_price = float(request.form.get('vcoinPrice'))
        is_premium = request.form.get('isPremium')
        item_name = request.form.get('name')
        description = request.form.get('description')
        if(is_premium == False):
            is_premium = 0
        else:
            is_premium = 1

        safe_filename = f"{item_name.replace(' ', '_')}.png"

        image_file = request.files.get('itemImageFile')
        if image_file:
            if not os.path.exists(ItemImage):
                os.makedirs(ItemImage)
            image_file_path = os.path.join(ItemImage, safe_filename)
            image_file.save(image_file_path)

        sql_content = """
                INSERT INTO item (itemTypeID, vcoinPrice, isPremium, filePath)
                VALUES (%s, %s, %s, %s)
            """
        cursor.execute(sql_content, (
                item_typeId,
                vcoin_price,
                is_premium,
                safe_filename
            ))
        conn.commit()
        item_Id = cursor.lastrowid

        sql_content = """
                INSERT INTO powerup (itemID, name, description)
                VALUES (%s, %s, %s)
            """
        cursor.execute(sql_content, (
                item_Id,
                item_name,
                description
        ))
        conn.commit()

        return jsonify({'isSuccess': True,"message": "Item saved successfully"}), 201
    
    if(item_typeId == 2):
        vcoin_price = float(request.form.get('vcoinPrice'))
        is_premium = request.form.get('isPremium')
        musicTitle = request.form.get('musicTitle')
        musicGenre = request.form.get('musicGenre')
        if(is_premium == False):
            is_premium = 0
        else:
            is_premium = 1

        safe_filename = f"{musicTitle.replace(' ', '_')}.mp3"

        audioFile = request.files.get('itemAudioFile')
        if audioFile:
            if not os.path.exists(BackGroundMusicDirectory):
                os.makedirs(BackGroundMusicDirectory)
            image_file_path = os.path.join(BackGroundMusicDirectory, safe_filename)
            image_file.save(image_file_path)

        sql_content = """
                INSERT INTO item (itemTypeID, vcoinPrice, isPremium, filePath)
                VALUES (%s, %s, %s, %s)
            """
        cursor.execute(sql_content, (
                item_typeId,
                vcoin_price,
                is_premium,
                safe_filename
            ))
        conn.commit()
        item_Id = cursor.lastrowid

        sql_content = """
                INSERT INTO backgroundMusic (itemID, musicTitle, musicGenre)
                VALUES (%s, %s, %s)
            """
        cursor.execute(sql_content, (
                item_Id,
                musicTitle,
                musicGenre
        ))
        conn.commit()

        return jsonify({'isSuccess': True,"message": "Item saved successfully"}), 201
    
    if(item_typeId == 3):
        price = float(request.form.get('moneyPrice'))
        bagName = request.form.get('coinBagName')
        quantity = int(request.form.get('quantity'))

        sql_content = """
                INSERT INTO coinbag (quantity, moneyPrice, coinBagName)
                VALUES (%s, %s, %s)
            """
        cursor.execute(sql_content, (
                quantity,
                price,
                bagName,
            ))
        conn.commit()
        return jsonify({'isSuccess': True,"message": "Item saved successfully"}), 201

    


def getItemType():
    con =get_db_connection()
    cursor = con.cursor(dictionary=True)
    query = "SELECT * FROM itemtype"
    cursor.execute(query)
    itemTypes = cursor.fetchall()
    if not itemTypes:
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
                'data': itemTypes,
                'data2': None,
                'totalCount': None 
            }), 200