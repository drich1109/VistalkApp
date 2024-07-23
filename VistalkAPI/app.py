from flask import Flask, request, jsonify
import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/items', methods=['POST'])
def create_item():
    data = request.get_json()
    name = data['name']
    description = data['description']
    conn = db.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO items (name, description) VALUES (%s, %s)", (name, description))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(data), 201

@app.route('/items', methods=['GET'])
def read_items():
    conn = db.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT typeName FROM questionType")
    items = cursor.fetchall()
    print(items)
    cursor.close()
    conn.close()
    return jsonify([{'name': item[0]} for item in items])

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
