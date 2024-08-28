# user.py
from db import get_db_connection
from flask import request, jsonify, send_from_directory
import os

PronunciationFolder = 'C:\\VistalkApp\\VistalkApp\\Vistalk Pronunciation Audio'
Syllables =  'C:\\VistalkApp\\VistalkApp\\Vistalk Pronunciation Audio\\Syllables'

if not os.path.exists(Syllables):
    os.makedirs(Syllables)

def get_ContentTypes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM contentType"
    cursor.execute(query)
    contentTypes = cursor.fetchall()
    if not contentTypes:
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
                'data': contentTypes,
                'data2': None,
                'totalCount': None 
            }), 200

def save_content():
    content_id = int(request.form.get('contentId', 0))
    content_text = request.form.get('contentText')
    english_translation = request.form.get('englishTranslation')
    language_id = int(request.form.get('languageId'))
    content_type_id = int(request.form.get('contentTypeId'))
    safe_filename = f"{content_text.replace(' ', '_')}.mp3"

    audio_path = safe_filename

    audio_file = request.files.get('contentAudioFile')
    audio_file_path = None
    if audio_file:
        if not os.path.exists(PronunciationFolder):
            os.makedirs(PronunciationFolder)
        audio_file_path = os.path.join(PronunciationFolder, safe_filename)
        audio_file.save(audio_file_path)

    syllables_data = []
    index = 0
    while True:
        syllable_content_id = request.form.get(f'syllables[{index}].contentId')
        if syllable_content_id is None:
            break
        syllable = {
            'contentId': int(syllable_content_id),
            'syllableText': request.form.get(f'syllables[{index}].syllableText'),
            'audioPath': request.form.get(f'syllables[{index}].syllableText'),
            'orderNumber': int(request.form.get(f'syllables[{index}].orderNumber')),
        }

        syllable_audio_file = request.files.get(f'syllables[{index}].audioFile')
        print(syllable_audio_file)
        if syllable_audio_file:
            safe_filename = f"{syllable['syllableText'].replace(' ', '_')}.mp3"
            syllable['audioPath'] = safe_filename
            syllable_audio_path = os.path.join(Syllables, safe_filename)
            syllable_audio_file.save(syllable_audio_path)

        syllables_data.append(syllable)
        index += 1

    definitions_data = []
    index = 0
    while True:
        definition_content_id = request.form.get(f'definitions[{index}].contentId')
        if definition_content_id is None:
            break
        definition = {
            'contentId': int(definition_content_id),
            'nativeDefinition': request.form.get(f'definitions[{index}].nativeDefinition'),
            'englishDefinition': request.form.get(f'definitions[{index}].englishDefinition'),
            'orderNumber': int(request.form.get(f'definitions[{index}].orderNumber')),
        }
        definitions_data.append(definition)
        index += 1

    examples_data = []
    index = 0
    while True:
        example_content_id = request.form.get(f'examples[{index}].contentId')
        if example_content_id is None:
            break
        example = {
            'contentId': int(example_content_id),
            'nativeExample': request.form.get(f'examples[{index}].nativeExample'),
            'englishExample': request.form.get(f'examples[{index}].englishExample'),
            'orderNumber': int(request.form.get(f'examples[{index}].orderNumber')),
        }
        examples_data.append(example)
        index += 1

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if content_id == 0:
            sql_content = """
                INSERT INTO content (contentText, englishTranslation, audioPath, languageId, contentTypeId)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql_content, (
                content_text,
                english_translation,
                audio_path,
                language_id,
                content_type_id
            ))
            conn.commit()
            content_id = cursor.lastrowid

            for syllable in syllables_data:
                sql_syllable = """
                    INSERT INTO contentsyllable (contentId, syllableText, audioPath, orderNumber)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_syllable, (
                    content_id,
                    syllable['syllableText'],
                    syllable['audioPath'],
                    syllable['orderNumber']
                ))
                conn.commit()

            for definition in definitions_data:
                sql_definition = """
                    INSERT INTO contentDefinition (contentId, nativeDefinition, englishDefinition, orderNumber)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_definition, (
                    content_id,
                    definition['nativeDefinition'],
                    definition['englishDefinition'],
                    definition['orderNumber']
                ))
                conn.commit()

            for example in examples_data:
                sql_example = """
                    INSERT INTO contentExample (contentId, nativeExample, englishExample, orderNumber)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_example, (
                    content_id,
                    example['nativeExample'],
                    example['englishExample'],
                    example['orderNumber']
                ))
                conn.commit()

        else:
            sql_update_content = """
                UPDATE content
                SET contentText = %s, englishTranslation = %s, audioPath = %s, languageId = %s, contentTypeId = %s
                WHERE contentId = %s
            """
            cursor.execute(sql_update_content, (
                content_text,
                english_translation,
                audio_path,
                language_id,
                content_type_id,
                content_id
            ))
            conn.commit()

        return jsonify({'isSuccess': True, "message": "Content saved successfully"}), 201

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'isSuccess': False, "message": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_Contents():
    langID = request.args.get('languageID')
    contentTypeId = request.args.get('contentTypeID')
    searchString = request.args.get('searchString')
    pageNo = int(request.args.get('pageNo', 1))
    print(pageNo)
    pageSize = 15
    offset = (pageNo - 1) * pageSize
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM content where languageID = %s and isActive = true
    """
    values = [langID,]

    if searchString:
        query += "AND (contentText LIKE %s OR englishTranslation LIKE %s)"
        likePattern = f"%{searchString}%"
        values.extend([likePattern, likePattern])
    
    if contentTypeId:
        query += "AND (contentTypeId = %s)"
        values.extend([contentTypeId])

    query += """
        ORDER BY contentText
        LIMIT %s OFFSET %s
    """
    values.extend([pageSize, offset])

    cursor.execute(query, tuple(values))
    contents = cursor.fetchall()
    count_query = "SELECT COUNT(*) as total FROM content WHERE languageID = %s"
    countvalues = [langID]
    if searchString:
        count_query += " AND (contentText LIKE %s OR englishTranslation LIKE %s)"
        likePattern = f"%{searchString}%"
        countvalues.extend([likePattern, likePattern])

    if contentTypeId:
        count_query += "AND (contentTypeId = %s)"
        countvalues.extend([contentTypeId])

    cursor.execute(count_query, tuple(countvalues))
    total_count = cursor.fetchone()['total']

    if not contents:
        return jsonify({
            'isSuccess': True,
            'message': 'No contents found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': contents,
                'data2': None,
                'totalCount': total_count
            }), 200


def getContentById():
    contentId = request.args.get('contentId')
    print(contentId)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM content where contentID = %s
    """
    values = [contentId,]

    cursor.execute(query, tuple(values))
    contents = cursor.fetchone()
    if not contents:
        return jsonify({
            'isSuccess': True,
            'message': 'No contents found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': contents,
                'data2': None,
                'totalCount': 1
            }), 200

def getSyllablesByContentId():
    contentId = request.args.get('contentId')
    print(contentId)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM contentSyllable where contentID = %s
    """
    values = [contentId,]

    cursor.execute(query, tuple(values))
    syllables = cursor.fetchall()
    if not syllables:
        return jsonify({
            'isSuccess': True,
            'message': 'No syllables found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': syllables,
                'data2': None,
                'totalCount': 0
            }), 200

def getDefinitionByContentId():
    contentId = request.args.get('contentId')
    print(contentId)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM contentDefinition where contentID = %s
    """
    values = [contentId,]

    cursor.execute(query, tuple(values))
    definitions = cursor.fetchall()
    if not definitions:
        return jsonify({
            'isSuccess': True,
            'message': 'No definitions found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': definitions,
                'data2': None,
                'totalCount': 0
            }), 200

def getExamplesByContentId():
    contentId = request.args.get('contentId')
    print(contentId)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM contentExample where contentID = %s
    """
    values = [contentId,]

    cursor.execute(query, tuple(values))
    examples = cursor.fetchall()
    if not examples:
        return jsonify({
            'isSuccess': True,
            'message': 'No examples found',
            'data': [],
            'data2': None,
            'totalCount': 0
        }), 200
    return jsonify({
                'isSuccess': True,
                'message': 'Successfully Retrieved',
                'data': examples,
                'data2': None,
                'totalCount': 0
            }), 200

def getFileByFileName():
    fileName = request.args.get('fileName') 
    isSyllable = request.args.get('isSyllable')
    print(fileName)

    print(isSyllable)
    if isSyllable == 'true':
        return send_from_directory(Syllables, fileName)
    elif isSyllable == 'false':
        return send_from_directory(PronunciationFolder, fileName)
    
def contentInactive():
    contentId = int(request.args.get('contentId')) 
    print(contentId)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        UPDATE content SET isActive = false where contentID = %s
    """
    print(query)
    values = [contentId,]
    cursor.execute(query, values)
    conn.commit()
    return jsonify({'isSuccess': True, "message": "Content updated successfully"}), 200

def sectionInactive():
    contentId = int(request.args.get('contentId')) 
    print(contentId)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        UPDATE content SET isActive = false where contentID = %s
    """
    print(query)
    values = [contentId,]
    cursor.execute(query, values)
    conn.commit()
    return jsonify({'isSuccess': True, "message": "Content updated successfully"}), 200


