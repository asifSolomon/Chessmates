import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from .auth_tokens import generate_access_token
import ssl


port = 465  # For SSL
smtp_server = "smtp.gmail.com"
sender_email = os.environ['sender_email']
password = os.environ['email-password']
URL = "https://chess-mates.herokuapp.com"


# email with reset link
def reset_token_email(receiver_email: list, user: str):
    token = str(generate_access_token(user))
    url = rf"{URL}/reset"
    subject = "Chessmates - Reset Password"
    html = f"""\
    <html>
      <body>
        <p>Hi, <b>{user}</b> <br> <br>
           :Here is your link for resetting your password <br>
           <b>Click on <a href= {url}/{token}>chessmates/{user}</a></b> <br>
           It will be expired in 10 minutes
        </p>
      </body>
    </html>
    """
    send_mail(receiver_email, subject, html)
    return token


# email with welcome message
def join_email(receiver_email: list, user: str):
    subject = "Welcome to Chessmates"
    html = f"""\
        <html>
          <body>
            <p>Hi, <b>{user}</b> <br> <br>
                Welcome to Chessmates <br>
                This mail will be used for resetting your password
            </p>
          </body>
        </html>
        """
    send_mail(receiver_email, subject, html)


def send_mail(receiver_email: list, subject: str, html: str):
    """
    send email to the user
    """

    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg['To'] = ", ".join(receiver_email)
    body_html = MIMEText(html, 'html')
    msg.attach(body_html)  # attaching to msg

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        print("sent to:")
        print(receiver_email)
