#emailService.py
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import request

def send_email(recipient_email, subject, message):
    if not recipient_email:
        return "No email provided", 400
    
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "vistalk101@gmail.com"
    app_password = "cevb navk gira eqzu"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    
    body = message
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, app_password)
        server.send_message(msg)
        server.quit()
        
        return "Email sent successfully"
    
    except Exception as e:
        return f"Failed to send email: {str(e)}", 500
