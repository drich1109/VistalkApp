from flask import Flask, request, jsonify
import db
from flask_cors import CORS
from Services import language

app = Flask(__name__)
CORS(app)

@app.route('/getLanguages', methods=['GET'])
def getLanguages():
    return language.get_Language()


if __name__ == "__main__":
    app.run(debug=db.DEBUG, host=db.HOST, port=db.PORT)
