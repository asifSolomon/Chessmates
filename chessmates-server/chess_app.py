from app import create_app, socketio

app = create_app(debug=True)

if __name__ == '__main__':
    app.run(debug=True)

# cd dir set FLASK_ENV=development flask run
# heroku ps:restart

