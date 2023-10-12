import os
import mysql.connector
from add_countries import sql, countries


# creating sql DB for the first time
def main():
    # create a connection
    my_db = mysql.connector.connect(
        host="sql8.freemysqlhosting.net",
        user="sql8529878",
        password= #todo password from env
    )
    cursor = my_db.cursor()

    # create DB
    # cursor.execute("""CREATE DATABASE `chess`;""")
    cursor.execute("""USE `sql8529878`;""")

    # # create table countries
    # cursor.execute("""CREATE TABLE `countries` (
    #   `Code` varchar(255) NOT NULL,
    #   `Label` varchar(255) NOT NULL,
    #   PRIMARY KEY (`Code`),
    #   UNIQUE KEY `Code_UNIQUE` (`Code`),
    #   UNIQUE KEY `Label_UNIQUE` (`Label`)
    # )
    # ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    # """)
    #
    # # create table ex
    # cursor.execute("""CREATE TABLE `ex` (
    #   `exID` int NOT NULL,
    #   `exFEN` varchar(255) NOT NULL,
    #   `exMoves` int NOT NULL,
    #   `exSolution` varchar(255) NOT NULL,
    #   PRIMARY KEY (`exID`),
    #   UNIQUE KEY `exID_UNIQUE` (`exID`),
    #   UNIQUE KEY `exFEN_UNIQUE` (`exFEN`)
    # )
    # ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    # """)
    #
    # # create table tokens
    # cursor.execute("""create table tokens
    # (
    #     token varchar(255)         not null,
    #     reset tinyint(1) default 0 not null,
    #     constraint refresh_UNIQUE
    #         unique (token)
    # )
    #  ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    # """)

    # # create table users
    # cursor.execute("""CREATE TABLE `users` (
    #   `UsrUserName` varchar(255) NOT NULL,
    #   `UsrEmail` varchar(255) NOT NULL,
    #   `UsrRating` int NOT NULL DEFAULT '1000',
    #   `UsrExRating` int NOT NULL DEFAULT '1000',
    #   `UsrCurrEx` int NOT NULL DEFAULT '1',
    #   `UsrCountry` varchar(255) NOT NULL,
    #   `UsrPassword` varchar(255) NOT NULL,
    #   `IsDel` tinyint(1) NOT NULL DEFAULT '0',
    #   PRIMARY KEY (`UsrUserName`),
    #   UNIQUE KEY `UsrUserName_UNIQUE` (`UsrUserName`),
    #   UNIQUE KEY `UsrEmail_UNIQUE` (`UsrEmail`)
    #   # KEY `exID_idx` (`UsrCurrEx`),
    #   # KEY `Code_idx` (`UsrCountry`),
    #   # CONSTRAINT `Code` FOREIGN KEY (`UsrCountry`) REFERENCES `countries` (`Code`) ON DELETE RESTRICT ON UPDATE CASCADE,
    #   # CONSTRAINT `exID` FOREIGN KEY (`UsrCurrEx`) REFERENCES Exercises (`exID`) ON DELETE RESTRICT ON UPDATE CASCADE
    # )
    # ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    # """)
    cursor.executemany(sql, countries)
    my_db.commit()
    cursor.close()


if __name__ == '__main__':
    main()
