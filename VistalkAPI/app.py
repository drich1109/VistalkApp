from flask import Flask, request, jsonify
import db
from flask_cors import CORS
from Services import user, section, content, question, shop

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['GET'])
def login_admin():
    return user.login()

@app.route('/saveSection', methods=['POST'])
def saveSection():
    return section.save_section()

@app.route('/getSections', methods=['GET'])
def getSections():
    return section.get_Sections()

@app.route('/getLanguages', methods=['GET'])
def getLanguages():
    return section.get_Language()

@app.route('/saveUnit', methods=['POST'])
def saveUnit():
    return section.save_units()

@app.route('/getUnits', methods=['GET'])
def getUnits():
    return section.get_Units()

@app.route('/getContentTypes', methods=['GET'])
def getContentTypes():
    return content.get_ContentTypes()

@app.route('/saveContent', methods=['POST'])
def saveContent():
    return content.save_content()

@app.route('/getContents', methods=['GET'])
def getcontent():
    return content.get_Contents()

@app.route('/getContentById', methods=['GET'])
def getcontentById():
    return content.getContentById()

@app.route('/getSyllablesByContentId', methods=['GET'])
def getSyllablesByContentId():
    return content.getSyllablesByContentId()

@app.route('/getDefinitionByContentId', methods=['GET'])
def getDefinitionByContentId():
    return content.getDefinitionByContentId()

@app.route('/getExamplesByContentId', methods=['GET'])
def getExamplesByContentId():
    return content.getExamplesByContentId()

@app.route('/getFileByFileName', methods=['GET'])
def getFileByFileName():
    return content.getFileByFileName()

@app.route('/getQuestionTypes', methods=['GET'])
def get_QuestionTypes():
    return question.get_QuestionTypes()

@app.route('/getChoices', methods=['GET'])
def get_choices():
    return question.get_choices()

@app.route('/saveQuestionMultiple', methods=['POST'])
def save_questionMultiple():
    return question.save_questionMultiple()

@app.route('/save_questionMatch', methods=['POST'])
def save_questionMatch():
    return question.save_question_match()

@app.route('/getItemType', methods=['GET'])
def getItemTypes():
    return shop.getItemType()

@app.route('/saveItemShop', methods=['POST'])
def saveItem():
    return shop.save_item()
  
@app.route('/contentInactive', methods=['PUT'])
def contentInactive():
    return content.contentInactive()

@app.route('/sectionInactive', methods=['PUT'])
def sectionInactive():
    return section.sectionInactive()

@app.route('/unitInactive', methods=['PUT'])
def unitInactive():
    return section.unitInactive()

@app.route('/questionInactive', methods=['PUT'])
def questionInactive():
    return question.questionInactive()

@app.route('/registerUser', methods=['POST'])
def registerVista():
    return user.createVista()

if __name__ == "__main__":
    app.run(debug=db.DEBUG, host=db.HOST, port=db.PORT)
