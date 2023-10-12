import datetime
import jwt
from .. import SECRET_TOKEN, REFRESH_TOKEN, my_db


def create_token(data: dict):
    """
    create a signed JWT with the data
    """
    return jwt.encode(data, SECRET_TOKEN, algorithm="HS256")


def generate_access_token(user: str):
    """
    generate a signed JWT with the current time
    """
    data = {"username": user, "exp": datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(minutes=20)}
    return create_token(data)


def generate_refresh_token(user: str):
    """
    generate a signed JWT to get new access tokens
    """
    token = jwt.encode({"username": user}, REFRESH_TOKEN, algorithm="HS256")
    sql = """INSERT INTO sql8529878.tokens (token) VALUES (%s)"""
    vals = (token,)
    my_db.update_db(sql, vals)
    return token


def get_new_access_token(refresh, new_dict: dict):
    """
    generate a new signed JWT by validating the refresh token
    """
    query = f"SELECT EXISTS(SELECT * from sql8529878.tokens WHERE token= %s)"
    exists = my_db.select_db(query, (refresh,))[0][0]
    if exists:
        try:
            user = jwt.decode(refresh, REFRESH_TOKEN, options={"require": ["username"]}, algorithms="HS256")["username"]
            if user == new_dict["username"]:
                new_dict["exp"] = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(minutes=11)
                return {"auth": create_token(new_dict)}
            else:
                print("tokens doesn't match")
                return "tokens doesn't match", 401
        except Exception as e:
            print(e)
            print("Invalid token")

            return "Invalid token", 401
    else:
        print("Token was logout")
        return "Token was logout", 401


def logout_refresh(refresh):
    """
    delete JWT from the DB
    """
    sql = """DELETE FROM sql8529878.tokens WHERE token= %s"""
    vals = (refresh,)
    my_db.update_db(sql, vals)


def auth_required(token):
    """
    validating the JWT
    """
    try:
        # trying to decode token with the secret key
        return jwt.decode(token, SECRET_TOKEN, options={"require": ["username", "exp"]}, algorithms="HS256")
    except jwt.exceptions.ExpiredSignatureError as e:
        return "Login expired, Please log in again", 401
    except Exception as e:
        print(e)
        print(f"token: {token}")
        return "Please log in", 401


def auth_refresh(token):
    """
    generate a signed JWT refresh token
    """
    try:
        return jwt.decode(token, REFRESH_TOKEN, options={"require": ["username"]}, algorithms="HS256")
    except Exception as e:
        print(e)
        print(f"token: {token}")
        return "Please log in", 401
