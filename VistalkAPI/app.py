from flask import Flask, request, jsonify
import db
from flask_cors import CORS
from Services import user, section, content, question, shop, emailService, feedback

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

@app.route('/loginVista', methods=['GET'])
def loginVista():
    return user.loginVista()

@app.route('/getQuestions', methods=['GET'])
def getQuestions():
    return question.get_Questions()

@app.route('/getMultipleChoice', methods=['GET'])
def getMultipleChoice():
    return question.get_multiple_choice()

@app.route('/getMatchingType', methods=['GET'])
def getMatchingType():
    return question.get_matching_type()  

@app.route('/forgotPassword', methods=['GET'])
def forgotPassword():
    return emailService.send_code_to_email()  

@app.route('/verifyCode', methods=['GET'])
def verifyCode():
    return emailService.verify_code()  

@app.route('/changePassword', methods=['PUT'])
def changePassword():
    return user.forgotPassword()  

@app.route('/getItemList', methods=['GET'])
def getItemList():
    return shop.get_items()  

@app.route('/getShopFileByFileName', methods=['GET'])
def getShopFileByFileName():
    return shop.getShopFileByFileName()  

@app.route('/itemInactive', methods=['PUT'])
def setItemInactive():
    return shop.itemInactive()  

@app.route('/coinBagInactive', methods=['PUT'])
def coinBagInactive():
    return shop.coinBagInactive()

@app.route('/getQuestionFiles', methods=['GET'])
def getQuestionFile():
    return question.getQuestionFile()  

@app.route('/getusers', methods=['GET'])
def get_Users():
    return user.get_Users()  

@app.route('/getuserPowerUps', methods=['GET'])
def get_UserPowerUps():
    return user.get_UserPowerUps()  

@app.route('/isEmailUse', methods=['GET'])
def is_email_used():
    return emailService.is_email_used()  

@app.route('/editVistaProfile', methods=['PUT'])
def editVistaProfile():
    return user.editVistaProfile()
  
@app.route('/deactivateVistaAccount', methods=['PUT'])
def deactivateVistaAccount():
    return user.deactivateVistaAccount()  

@app.route('/getFeedbacks', methods=['GET'])
def getFeedbacks():
    return feedback.get_feedback()  


if __name__ == "__main__":
    app.run(debug=db.DEBUG, host=db.HOST, port=db.PORT)
