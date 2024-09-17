from flask import Flask, request, jsonify
import db
from flask_cors import CORS
from Services import language, pronunciation, user

app = Flask(__name__)
CORS(app)

@app.route('/getLanguages', methods=['GET'])
def getLanguages():
    return language.get_Language()

@app.route('/checkPronunciation', methods=['POST'])
def checkPronunciation():
    return pronunciation.check_pronunciation()

@app.route('/getUserLanguage', methods=['GET'])
def getUserLanguage():
    return language.getUserLanguage()

@app.route('/getUserImage', methods=['GET'])
def getUserImage():
    return user.getUserImage()

@app.route('/getUserDetails', methods=['GET'])
def getUserDetails():
    return user.getUserDetails()

@app.route('/addfeedback', methods=['POST'])
def addfeedback():
    return user.add_feedback()

if __name__ == "__main__":
    app.run(debug=db.DEBUG, host=db.HOST, port=db.PORT)
