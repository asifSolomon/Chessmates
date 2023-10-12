import secrets
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_session import Session
from db.db import DB
from flask_talisman import Talisman

# secrets.token_hex(64) - from env
SECRET_TOKEN = #TODO add key
REFRESH_TOKEN = #TODO add key

socketio = SocketIO(cors_allowed_origins="*", manage_session=False)
my_db = DB()
players_search = {}
online_users = []
games = {}
playing = {}
searching = []
puzzles = {}


def create_app(debug=False):
    """ Create an application """
    app = Flask(__name__)
    app.debug = debug
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SECRET_KEY"] = secrets.token_hex(64)
    app.config["SESSION_USE_SIGNER"] = True
    CORS(app, supports_credentials=True)
    Session(app)  # server side session is more secured
    Talisman(app, content_security_policy=None)
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    socketio.init_app(app, cors_allowed_origins="*", logger=True, engineio_logger=True)
    return app
