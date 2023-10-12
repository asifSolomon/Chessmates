import os
import mysql.connector


def init_db():
    """ Inits the connection to the DB.
     :return: connection to the app's DB
     :rtype: MySQL connection
    """
    return mysql.connector.connect(
        host="sql8.freemysqlhosting.net",
        user="sql8529878",
        password=os.environ["db-pass"]
    )


class DB:
    """
    A class the manages the interaction with the DB
    """

    def __init__(self):
        """
        Create a new MySQL connection.
        """
        self.conn = init_db()
        self.cursor = self.conn.cursor(prepared=True)

    def update_db(self, sql: str, val: tuple):
        """
        Manage update query.
        """
        try:
            self.cursor.execute(sql, val)
            self.conn.commit()
        except mysql.connector.Error as error:
            print(sql)
            print(f"parameterized query failed:\n {error}")
            return "failed"

    def select_db(self, sql: str, val: tuple = None):
        """
        Manage select query.
        """
        try:
            if val:
                self.cursor.execute(sql, val)
            else:
                self.cursor.execute(sql)
            res = self.cursor.fetchall()
            return res
        except mysql.connector.Error as error:
            # delete
            print(sql)
            print(f"parameterized query failed:\n {error}")
            return "failed"

    def do_sign_up(self, params: dict):
        """
        Handles a valid sign up request.
        """
        sql = """
        INSERT INTO sql8529878.users (UsrUserName, UsrEmail, UsrCountry, UsrPassword,UsrRating,UsrExRating) 
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        vals = (params["username"], params["email"], params["country"], params["password"], params["rating"],
                params["rating"])
        error = self.update_db(sql, vals)
        if error:
            return error, 400
        else:
            return "success"

    def close(self):
        """
        Close the connection.
        """
        self.cursor.close()
