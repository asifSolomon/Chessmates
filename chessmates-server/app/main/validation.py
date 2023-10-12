import re
from functools import wraps
import bcrypt
from flask import request

from app.main.auth_tokens import auth_required


def valid_login(user_or_email: str, password: str, db):
    """
    validate a login request
    """
    query = f"SELECT UsrPassword from sql8529878.users WHERE (UsrUserName= %s OR UsrEmail= %s) LIMIT 1"
    try:
        # get the hashed password from the db
        hashed = db.select_db(query, (user_or_email, user_or_email))[0][0]

        # compares the input by using the salt in the hashed password
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except:
        return False


def v_username(user: str, db):
    """
    validate a new username
    """
    user = user.strip()
    query = f"SELECT EXISTS(SELECT * from sql8529878.users WHERE UsrUserName= %s LIMIT 1)"
    not_unique = db.select_db(query, (user,))[0][0]
    if not_unique:
        return "Username is already used"

    if re.fullmatch(r"[A-Za-z]\w{5,29}", user):
        return None
    else:
        return "Username must be between 5 to 30 characters and start with a letter"


def v_email(email: str, db):
    """
    validate a new email
    """
    email = email.strip()
    query = f"SELECT EXISTS(SELECT * from sql8529878.users WHERE UsrEmail= %s LIMIT 1)"
    not_unique = db.select_db(query, (email,))[0][0]
    if not_unique:
        return "Email is already used"

    if re.fullmatch(r'[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]', email):
        return None
    else:
        return "Invalid email"


def v_reset_pass_email(email: str, db):
    """
    checks if email exists
    """
    email = email.strip()
    query = f"SELECT EXISTS(SELECT * from sql8529878.users WHERE UsrEmail= %s LIMIT 1)"
    not_unique = db.select_db(query, (email,))[0][0]
    if not not_unique:
        return "Unknown email"
    return "ok"


def v_pass(password: str):
    """
    validate a new password
    """
    if re.fullmatch(r"(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}", password):
        return None
    else:
        return "Password must be at least 8 characters, one letter, one number and one special character"


def v_rating(num: str):
    """
    validate a new rating
    """
    if num.isdigit() and 1000 <= int(num) <= 2000:
        return None
    else:
        return "Invalid rating"


def v_country(country: str, db):
    """
    validate a new country
    """
    query = f"SELECT EXISTS(SELECT * from sql8529878.countries WHERE Code= %s LIMIT 1)"
    exist = db.select_db(query, (country,))[0][0]
    if exist:
        return None
    else:
        return "Invalid country code"


def valid_sign_up(params: dict, db):
    """
    validate a signup request
    """
    error = v_username(params["username"], db)
    if error is not None:
        return error
    error = v_email(params["email"], db)
    if error is not None:
        return error
    error = v_pass(params["password"])
    if error is not None:
        return error
    error = v_rating(params["rating"])
    if error is not None:
        return error
    error = v_country(params["country"], db)
    if error is not None:
        return error
    return None


def valid_update(params: dict, db):
    """
    validate a update request
    """
    update = {}
    if "old_pass" in params:
        if valid_login(params["old_user"], params["old_pass"], db):
            error = v_pass(params["new_pass"])
            if error:
                return error, 400
            else:
                salt = bcrypt.gensalt()
                hashed = bcrypt.hashpw(params["new_pass"].encode(), salt)
                update["pass"] = hashed
        else:
            return "Password is not correct", 403

    sql = "SELECT * FROM sql8529878.users WHERE usrUserName= %s"
    print(db.select_db(sql, (params["old_user"],)))
    res = db.select_db(sql, (params["old_user"],))[0]
    print("res:")
    print(res)

    sql = "DELETE FROM sql8529878.users WHERE usrUserName= %s"
    db.update_db(sql, (params["old_user"],))
    error = v_username(params["new_user"], db)
    if error is None:
        update["user"] = params["new_user"]
        error = v_email(params["new_email"], db)
        if error is None:
            update["email"] = params["new_email"]
            error = v_country(params["new_code"], db)

    sql = """
    INSERT INTO sql8529878.users (UsrUserName, UsrEmail,UsrRating,UsrExRating,UsrCurrEx, UsrCountry, UsrPassword, IsDel) 
    VALUES (%s, %s, %s, %s, %s, %s,%s,%s)
    """
    db.update_db(sql, res)

    if error is None:
        update["code"] = params["new_code"]
        if "pass" in update:
            sql = f"UPDATE sql8529878.users SET UsrPassword= %s,UsrUserName=%s," \
                  f"UsrEmail=%s,UsrCountry=%s  WHERE UsrUserName=%s"
            vals = (update["pass"], update["user"], update["email"], update["code"], params["old_user"])
        else:
            sql = f"UPDATE sql8529878.users SET UsrUserName=%s, UsrEmail=%s,UsrCountry=%s  WHERE UsrUserName=%s"
            vals = (update["user"], update["email"], update["code"], params["old_user"])
        db.update_db(sql, vals)
        return None
    else:
        return error, 400


def login_required(f):
    """
    decorator that force using a valid token on the request
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("auth")
        res = auth_required(token)
        if "username" in res:
            return f(*args, **kwargs)
        return res

    return decorated_function
