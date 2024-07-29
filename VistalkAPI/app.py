from flask import Flask, request, jsonify
import db
from flask_cors import CORS
from Services import user  # Import from services folder

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['GET'])
def login_admin():
    return user.login()

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
