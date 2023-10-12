import uuid
from flask import request
from flask_socketio import emit, send, leave_room, join_room
from .. import socketio, players_search, games, online_users, playing, searching, my_db, puzzles
from app.main.chess_game import Game
from .auth_tokens import auth_required, create_token


def create_game(time: int, game_id: str = str(uuid.uuid4())):
    """
    create a new chess game
    """
    games[game_id] = Game(time * 60 + 15)
    print(games)
    return game_id


def update_jwt_dict(new_dict: dict, token):
    """
    update jwt to the new one
    """
    data = auth_required(token)
    if "username" in data:
        token = create_token(new_dict)
        print("new_dict: ")
        print(new_dict)
        emit("update_token", {"auth": token})


def rating_change(won: str, lost: str):
    """
    update the rating change after a game
    """
    sql = f"SELECT UsrRating from sql8529878.users WHERE (UsrUserName= %s) LIMIT 1"
    res_won = my_db.select_db(sql, (won,))[0][0]
    res_lost = my_db.select_db(sql, (lost,))[0][0]
    sql = f"UPDATE sql8529878.users SET UsrRating= %s WHERE UsrUserName=%s"
    my_db.update_db(sql, (res_won + 10, won))
    my_db.update_db(sql, (res_lost - 10, lost))


def game_over(game_status: dict, room, username: str):
    """
    handles game over and rating change
    """

    emit("game_over", game_status, to=room)
    game_status = game_status["res"]
    if username in playing and playing[username]["opponent"] in playing:
        opponent = playing[username]["opponent"]
        user_color = playing[username]["color"]
        opponent_color = playing[username]["color"]
        if game_status.startswith(user_color):
            rating_change(username, opponent)
        elif game_status.startswith(opponent_color):
            rating_change(opponent, username)
        else:
            print("draw")
        del playing[username]
        del playing[opponent]


@socketio.on('connect')
def connect():
    """
    connect a new client
    """
    token = request.args.get("auth")
    data = auth_required(token)

    if "username" in data:
        emit("new_users", broadcast=True)
        data["auth"] = "viewer"
        update_jwt_dict(data, token)
    else:
        return False


@socketio.on('disconnect')
def disconnect():
    """
    disconnect a client
    """
    emit("new_users", broadcast=True)
    print("disconnecting:")
    print(online_users)


@socketio.event
def check_time(data: dict):
    """
    checks if time is up in the chess game
    """
    token = data.get("auth")
    jwt_dict = auth_required(token)
    if "username" in jwt_dict and "room" in jwt_dict:
        room = jwt_dict["room"]
        game = games[room]
        res = game.check_time()
        if res != "ok":
            game_over(res, room, jwt_dict["username"])


@socketio.event
def puzzle_move(data: dict):
    """
    handles a move in the puzzle
    """
    token = data.get("auth")
    jwt_dict = auth_required(token)
    if "username" in jwt_dict and "move" in data and jwt_dict["username"] in puzzles:
        solution = puzzles[jwt_dict["username"]]
        if data["move"] == solution[0]:
            promotion = data["move"][4].upper() if len(data["move"]) == 5 else None
            res_dict = {
                "color": "white",
                "promotionPiece": promotion,
                "move": [data["move"][0], 8 - int(data["move"][1]), data["move"][2], 8 - int(data["move"][3])],
                "game_options": {
                    "k": False,
                    "q": False,
                    "en passant":
                        {
                            "i": -1,
                            "j": -1
                        }
                }
            }
            emit("move", res_dict)
            emit("status", "check")
            if len(solution) > 1:
                resp = solution[1]
                res_dict["color"] = "black"
                res_dict["promotionPiece"] = resp[4] if len(resp) == 5 else None
                res_dict["move"] = [resp[0], resp[1], resp[2], resp[3]]  # already fine in db
                emit("move", res_dict)
                puzzles[jwt_dict["username"]] = puzzles[jwt_dict["username"]][2:]
            else:
                emit("status", "finished")
                sql = f"SELECT UsrCurrEx from sql8529878.users WHERE (UsrUserName= %s) LIMIT 1"
                curr_ex = my_db.select_db(sql, (jwt_dict["username"],))[0][0]
                sql = f"UPDATE sql8529878.users SET UsrCurrEx= %s WHERE UsrUserName=%s"
                my_db.update_db(sql, (curr_ex + 1, jwt_dict["username"]))
                del puzzles[jwt_dict["username"]]
        else:
            emit("status", "wrong")


@socketio.event
def move(data: dict):
    """
    handles a move in the game
    """
    token = data.get("auth")
    jwt_dict = auth_required(token)
    print(jwt_dict)
    if "username" in jwt_dict and "room" in jwt_dict and jwt_dict.get("auth") == "player" \
            and "color" in jwt_dict and "move" in data:
        color = jwt_dict["color"]
        room = jwt_dict["room"]
        game = games[room]
        possible = game.possible_move(color, data["move"])
        if isinstance(possible, dict):
            game_over(possible, room, jwt_dict["username"])
        elif possible:
            accepted_move = data["move"]
            res_dict = {
                "color": color,
                "promotionPiece": None,
                "move": [accepted_move[0], 8 - int(accepted_move[1]), accepted_move[2], 8 - int(accepted_move[3])],
                "game_options": {
                    "k": game.board.has_kingside_castling_rights(color != "white"),  # next move color
                    "q": game.board.has_queenside_castling_rights(color != "white")  # next move color
                }
            }
            if game.board.ep_square is not None:
                res_dict["game_options"]["en passant"] = \
                    {"i": 7 - game.board.ep_square // 8, "j": game.board.ep_square % 8}
                print({"i": 7 - game.board.ep_square // 8, "j": game.board.ep_square % 8})
            if len(accepted_move) == 5:
                res_dict["promotionPiece"] = (accepted_move[4] if color == "black" else accepted_move[4].upper())
            emit("move", res_dict, to=room)
            if game.game_over:
                game_over(game.game_status(), room, jwt_dict["username"])
        else:
            print("INVALID MOVE")


@socketio.event
def search_game(data: dict):
    """
    searching for a game
    """

    token = data.get("auth")
    jwt_dict = auth_required(token)
    if "username" in jwt_dict and "time" in data:
        if jwt_dict["username"] in playing.keys():
            print("not this time")
            return
        if jwt_dict["username"] in searching:
            searching.remove(jwt_dict["username"])
        time = data["time"]
        opponent = players_search.get(time)
        if opponent:
            del players_search[time]
            game_id = create_game(time)
            playing[jwt_dict["username"]] = {"game_id": game_id, "color": "white", "opponent": opponent["username"]}
            playing[opponent["username"]] = {"game_id": game_id, "color": "black", "opponent": jwt_dict["username"]}
            if opponent["username"] in searching:
                searching.remove(opponent["username"])
            emit("game_started")
            emit("game_started", to=opponent["sid"])
        else:
            players_search[time] = {
                "username": jwt_dict["username"],
                "sid": request.sid
            }
            searching.append(jwt_dict["username"])
        print("players_search: ", players_search)


@socketio.event
def start_game(data: dict):
    """
    starts a new game
    """
    token = data.get("auth")
    jwt_dict = auth_required(token)
    if "username" in jwt_dict:
        user = jwt_dict["username"]
        details = playing.get(user)
        if details:
            jwt_dict["auth"] = "player"
            jwt_dict["color"] = details["color"]
            jwt_dict["opponent"] = details["opponent"]
            room = details["game_id"]
            jwt_dict["room"] = room
            update_jwt_dict(jwt_dict, token)

            join_room(room)
            print(f"{user} has entered the room: {room}.")
            send(user + " has entered the room.", to=room)


@socketio.event
def chat_message(data):
    """
    send a new message in the chat
    """
    token = data.get("auth")
    jwt_dict = auth_required(token)
    if "username" in jwt_dict and "message" in data:
        emit("chat_message", {
            "message": data['message'],
            "sender": jwt_dict['username']
        }, to=jwt_dict["room"])
        print("received message: " + str(data))
