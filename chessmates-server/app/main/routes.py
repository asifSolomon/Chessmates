import datetime
from flask import request, jsonify
from .validation import valid_sign_up, valid_login, login_required, v_reset_pass_email, v_pass, valid_update
from . import main
from .. import online_users, my_db, playing, searching, puzzles
from .helpers import do_log_in,get_user_data
import bcrypt
from .auth_tokens import logout_refresh, auth_required, get_new_access_token, auth_refresh, create_token, \
    generate_refresh_token
from .mail_services import reset_token_email, join_email


@main.route('/signup', methods=['POST'])
def signup():
    """
    handles signup request
    """
    params = {"username": request.form.get('username'),
              "password": request.form.get('password'),
              "email": request.form.get('email'),
              "rating": request.form.get('rating'),
              "country": request.form.get('country')
              }
    for element in params.values():
        if element is None:
            return "please fill all fields", 400
        elif len(element) > 50:
            return "Too long input", 400

    error = valid_sign_up(params, my_db)
    if error is None:
        # generating salt for the password
        salt = bcrypt.gensalt()

        # hashing using the salt
        hashed = bcrypt.hashpw(request.form.get('password').encode(), salt)
        params["password"] = hashed

        # doing sign up
        res = my_db.do_sign_up(params)
        if res != "success":
            return res
        else:
            join_email([params["email"]], params["username"])
            return "ok", 201
    else:
        return error, 400  # 400 - validation error


@main.route('/forgot')
def forgot_pass():
    """
    handles forgot password request
    """
    email = request.headers.get('email')
    if email:
        error = v_reset_pass_email(email, my_db)
        print(error)
        if error == "ok":
            query = f"SELECT UsrUserName from sql8529878.users WHERE (UsrEmail= %s) LIMIT 1"
            user = my_db.select_db(query, (email, ))[0][0]
            token = reset_token_email([email], user)
            sql = """INSERT INTO sql8529878.tokens (token,reset) VALUES (%s,true)"""
            vals = (token,)
            my_db.update_db(sql, vals)
    return "done"


@main.route('/reset/<token>', methods=['POST'])
def reset_pass(token):
    """
    handles reset password request
    """
    query = f"SELECT EXISTS(SELECT * from sql8529878.tokens WHERE token= %s AND reset= true)"
    exists = my_db.select_db(query, (token,))[0][0]

    if exists:
        data = auth_required(token)
        new_pass = request.form.get('password')
        error = v_pass(new_pass)
        if error is None and "username" in data and new_pass:
            query = f"Delete from sql8529878.tokens WHERE token= %s AND reset= true"
            my_db.update_db(query, (token,))
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(new_pass.encode(), salt)
            sql = f"UPDATE sql8529878.users SET UsrPassword= %s WHERE UsrUserName=%s"
            my_db.update_db(sql, (hashed, data["username"]))
            return "done"
        else:
            return error, 400
    return "Please use the link from your email only one time", 400


@main.route('/login', methods=['POST'])
def login():
    """
    handles login request
    """
    user_or_email = request.form.get('username/email')
    password = request.form.get('password')
    if user_or_email is None or password is None:
        return "Please fill all fields", 400
    if valid_login(user_or_email, password, my_db):
        return do_log_in(request.form.get('username/email'), my_db)
    else:
        """
        401 is Similar to 403 Forbidden, but specifically for use when 
        authentication is possible, but has failed or not yet been provided.
        """
        return 'Username or password are not correct', 401


@main.route('/get_user')
@login_required
def get_user():
    """
    handles get user data request
    """
    data = auth_required(request.headers.get("auth"))
    return get_user_data(data['username'])


@main.route('/update_user', methods=['POST'])
@login_required
def update_user():
    """
    handles update user data request
    """
    data = auth_required(request.headers.get("auth"))
    print(data)
    user = data["username"]
    params = {
        "old_user": user,
        "new_email": request.form.get("email"),
        "new_user": request.form.get("username"),
        "new_code": request.form.get("country"),
        }
    if request.form.get("new_pass") and request.form.get("old_pass"):
        params["new_pass"] = request.form.get("new_pass")
        params["old_pass"] = request.form.get("old_pass")

    for element in params.values():
        if element is None:
            return "please fill all fields", 400
        elif len(element) > 50:
            return "Too long input", 400
    error = valid_update(params, my_db)
    if error is None:
        data["username"] = request.form.get("username")
        data["exp"] = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(minutes=10)
        auth = create_token(data)
        refresh = generate_refresh_token(request.form.get("username"))
        online_users.remove(user)
        online_users.append(request.form.get("username"))
        return {"auth": auth, "refresh": refresh}

    else:
        return error


@main.route('/get_opponent')
@login_required
def get_opponent():
    """
    handles get opponent data request
    """
    data = auth_required(request.headers.get("auth"))
    user = data["username"]
    details = playing.get(user)
    if details and "opponent" in details :
        query = f"SELECT UsrUserName,UsrRating,UsrCountry" \
                f" from sql8529878.users WHERE (UsrUserName= %s) LIMIT 1"
        val = (details['opponent'],)
        res = my_db.select_db(query, val)[0]
        res_dict = {
            "opponent": {"username": res[0], "elo": res[1], "code": res[2].lower()},
            "color": details["color"]
        }
        return jsonify(res_dict)
    else:
        return "no opponent", 400


@main.route('/get_users')
@login_required
def get_users():
    """
    handles get users data request
    """
    val = tuple(online_users)
    if len(online_users) == 0:
        return jsonify(["no_user"])
    format_strings = ','.join(['%s'] * len(online_users))
    print(online_users)
    query = "SELECT UsrUserName,UsrRating,UsrCountry from sql8529878.users WHERE UsrUserName IN ({})".format(format_strings)
    res = my_db.select_db(query, val)
    print(res)
    dict_users = [{"username": user[0], "elo": user[1], "code": user[2].lower()} for user in res]
    dict_users.sort(key=lambda user: user["elo"], reverse=True)
    return jsonify(dict_users)


@main.route('/update_token_refresh')
@login_required
def update_token_refresh():
    """
    handles update refresh token request
    """
    new_dict = auth_required(request.headers.get("auth"))
    return get_new_access_token(request.headers.get("refresh"), new_dict)


@main.route('/new_puzzle')
@login_required
def new_puzzle():
    jwt_dict = auth_required(request.headers.get("auth"))
    if "username" in jwt_dict:
        sql = f"SELECT exFEN,exSolution from sql8529878.ex where exID =" \
              f" (SELECT UsrCurrEx from sql8529878.users WHERE (UsrUserName= %s))"
        fen, solution = my_db.select_db(sql, (jwt_dict["username"],))[0]
        puzzles[jwt_dict["username"]] = solution.split("@@")
        return fen


@main.route('/logout')
def logout():
    """
    handles logout request
    """
    logout_refresh(request.headers.get("refresh"))
    data = auth_refresh(request.headers.get("refresh"))
    if "username" in data:
        user = data["username"]
        print("user")
        print(user)
        if user and user in online_users:
            online_users.remove(user)
        if user in searching:
            searching.remove(user)
        if user in playing:
            del playing[user]
        if user in puzzles:
            del puzzles[user]

    return "ok"
