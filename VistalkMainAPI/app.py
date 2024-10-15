from flask import Flask, request, jsonify
import db
from flask_cors import CORS
from Services import language, pronunciation, user, content, shop, payment,section

app = Flask(__name__)
CORS(app)

@app.route('/getLanguages', methods=['GET'])
def getLanguages():
    return language.get_Language()

@app.route('/getSections', methods=['GET'])
def getSections():
    return section.get_Sections()

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
def get_user_details_route():
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

@app.route('/getPowerUps', methods=['GET'])
def getPowerUps():
    return shop.getPowerUps()

@app.route('/getUserPowerUp', methods=['GET'])
def getUserPowerUps():
    return user.getUserPowerUp()

@app.route('/getItemImage', methods=['GET'])
def getItemImage():
    return shop.getItemImage()

@app.route('/getUserVcoin', methods=['GET'])
def getUserVcoin():
    return shop.getUserVcoin()

@app.route('/buyPowerUp', methods=['PUT'])
def buyPowerUp():
    return shop.buyPowerUp()

@app.route('/getSubscriptions', methods=['GET'])
def getSubscriptions():
    return shop.getSubscriptions()

@app.route('/paymongoRedirect', methods=['POST'])
def paymentSubscription():
    return payment.paymongoredirect()

""" @app.route('/paymongowebhooks', methods=['POST'])
def paymongo_webhook():
    return payment.paymongo_webhook()
 """

@app.route('/buySubscription', methods=['POST'])
def buySubscription():
    return shop.buySubscription()

@app.route('/getCoinBags', methods=['GET'])
def getCoinBags():
    return shop.getCoinBags()

@app.route('/buyCoinBag', methods=['POST'])
def buyCoinBag():
    return shop.buyCoinBag()

@app.route('/getMusic', methods=['GET'])
def getMusic():
    return shop.getMusic()

@app.route('/buyMusic', methods=['PUT'])
def buyMusic():
    return shop.buyMusic()

@app.route('/getBackgroundMusic', methods=['GET'])
def getBackgroundMusic():
    return shop.getBackgroundMusic()
  
@app.route('/getUnits', methods=['GET'])
def getUnits():
    return section.get_Units()

@app.route('/getUnitQuestions', methods=['GET'])
def get_UnitQuestions():
    return section.getUnitQuestions()

@app.route('/getQuestionFiles', methods=['GET'])
def get_QuestionFiles():
    return section.getQuestionFiles()

if __name__ == "__main__":
    app.run(debug=db.DEBUG, host=db.HOST, port=db.PORT)
