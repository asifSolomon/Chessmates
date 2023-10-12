from flask import jsonify
from .. import online_users, my_db
from .auth_tokens import generate_access_token, generate_refresh_token


def do_log_in(user_or_email: str, db):
    """
    handles login by client
    """
    query = f"SELECT UsrUserName from sql8529878.users WHERE (UsrUserName= %s OR UsrEmail= %s) LIMIT 1"
    user = db.select_db(query, (user_or_email, user_or_email))[0][0]
    if user in online_users:
        return "Please logout first", 401
    online_users.append(user)
    return {"access_token": generate_access_token(user), "refresh_token": generate_refresh_token(user)}


def get_user_data(user: str):
    """
    return data about a user
    """
    query = f"SELECT UsrUserName,UsrRating,UsrExRating,UsrCurrEx,UsrCountry, UsrEmail" \
            f" from sql8529878.users WHERE (UsrUserName= %s) LIMIT 1"
    val = (user,)
    res = my_db.select_db(query, val)[0]
    dict_users = {"username": res[0], "elo": res[1], "exElo": res[2],
                  "currEx": res[3], "code": res[4].lower(), "email": res[5]}
    return jsonify(dict_users)
