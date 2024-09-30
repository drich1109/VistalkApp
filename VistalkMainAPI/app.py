from flask import Flask, request, jsonify
import db
from flask_cors import CORS
from Services import language, pronunciation, user, content

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

@app.route('/getContent', methods=['GET'])
def getContent():
    return content.get_Content()

@app.route('/getContentByID', methods=['GET'])
def getContentByID():
    return content.getContentByID()

@app.route('/getContentDefinitionByID', methods=['GET'])
def getContentDefinitionByID():
    return content.getContentDefinitionByID()

@app.route('/getContentExampleByID', methods=['GET'])
def getContentExampleByID():
    return content.getContentExampleByID()

@app.route('/getContentSyllableByID', methods=['GET'])
def getContentSyllableByID():
    return content.getContentSyllableByID()

@app.route('/getContentPronunciation', methods=['GET'])
def getContentPronunciation():
    return content.getContentPronunciation()

@app.route('/getSyllablePronunciation', methods=['GET'])
def getSyllablePronunciation():
    return content.getSyllablePronunciation()

if __name__ == "__main__":
    app.run(debug=db.DEBUG, host=db.HOST, port=db.PORT)
