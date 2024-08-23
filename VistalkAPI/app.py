from flask import Flask, request, jsonify
import db
from flask_cors import CORS
from Services import user, section, content

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

if __name__ == "__main__":
    app.run(debug=db.DEBUG, host=db.HOST, port=db.PORT)
