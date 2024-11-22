from flask import Flask, request, jsonify
import db
from flask_cors import CORS
import language, dailyTask, user, content, shop, payment,section, pronunciation
from apscheduler.schedulers.background import BackgroundScheduler
import time
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

def start_background_service():
    scheduler = BackgroundScheduler()
    scheduler.add_job(user.check_all_users_subscriptions, 'interval', hours=1)
    scheduler.start()
    try: 
          while True:
            time.sleep(3600)  
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        
@app.route('/getLanguages', methods=['GET'])
def getLanguages():
    return language.get_Language()

@app.route('/getSections', methods=['GET'])
def getSections():
    return section.get_Sections()

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

@app.route('/getContentPronunciation', methods=['GET'])
def get_ContentPronunciation():
    return content.get_ContentPronunciation()

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

@app.route('/webhook', methods=['POST'])
def paymongo_webhook():
    return payment.handle_webhook()

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

@app.route('/addreport', methods=['POST'])
def addreport():
    return user.add_report()

@app.route('/saveGamePlay', methods=['PUT'])
def saveGamePlay():
    return user.saveGamePlay()

@app.route('/getLeaderBoards', methods=['GET'])
def getLeaderBoards():
    return user.getLeaderBoards()

@app.route('/updateDailyScore', methods=['PUT'])
def updateDailyScore():
    return user.updateDailyScore()

@app.route('/claimReward', methods=['PUT'])
def claimReward():
    return user.claim_reward()


@app.route('/getSelfRank', methods=['GET'])
def getSelfRank():
    return user.getSelfRank()

@app.route('/getSelfRankAllTime', methods=['GET'])
def getSelfRankAllTime():
    return user.getSelfRankAllTime()

@app.route('/getLeaderBoardsAllTime', methods=['GET'])
def getLeaderBoardsAllTime():
    return user.getLeaderBoardsAllTime()

@app.route('/addRating', methods=['POST'])
def addRating():
    return user.addRating()

@app.route('/getDailyTasks', methods=['GET'])
def getDailyTasks():
    return dailyTask.getDailyTasks()

@app.route('/getNotifications', methods=['GET'])
def getNotifications():
    return user.get_notifications()

@app.route('/updateNotifications', methods=['PUT'])
def updateNotifications():
    return user.updateNotifications()

@app.route('/checkPronunciation', methods=['PUT'])
def checkPronunciation():
    return pronunciation.checkPronunciation()

@app.route('/getPronunciationProgress', methods=['GET'])
def getPronunciationProgress():
    return pronunciation.getPronunciationProgress()

@app.route('/getPronunciationList', methods=['GET'])
def getPronunciationList():
    return pronunciation.getPronunciationList()

@app.route('/getPronunciationCount', methods=['GET'])
def getPronunciationCount():
    return pronunciation.getPronunciationCount()

if __name__ == "__main__":
    from threading import Thread
    def start_services():
        thread = Thread(target=start_background_service)
        thread.daemon = True  
        thread.start()
    start_services()
    socketio.run(app, debug=db.DEBUG, host=db.HOST, port=db.PORT)
