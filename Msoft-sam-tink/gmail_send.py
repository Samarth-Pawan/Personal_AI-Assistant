import os
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import sys


# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://mail.google.com/']

def get_credentials():
    """Gets valid user credentials from storage.

    If nothing has been stored, or if the stored credentials are invalid,
    the OAuth2 flow is completed to obtain the new credentials.

    Returns:
        Credentials, the obtained credential.
    """
    creds = None
    home_dir = os.path.expanduser('~')
    credential_dir = os.path.join(home_dir, '.credentials')
    if not os.path.exists(credential_dir):
        os.makedirs(credential_dir)
    credential_path = os.path.join(credential_dir, 'gmail-quickstart.json')

    if os.path.exists(credential_path):
        creds = Credentials.from_authorized_user_file(credential_path, SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Failed to refresh token: {e}")
                creds = None
                if os.path.exists(credential_path):
                    os.remove(credential_path)  # Delete the expired token file
        if not creds:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(credential_path, 'w') as token:
            token.write(creds.to_json())

    return creds

def create_message(sender, to, cc, bcc, subject, message_text, attachments):
    """Create a message for an email.

    Args:
        sender: Email address of the sender.
        to: List of email addresses of the receivers.
        cc: List of email addresses for CC.
        bcc: List of email addresses for BCC.
        subject: The subject of the email message.
        message_text: The text of the email message.
        attachments: List of file paths to attach to the email.

    Returns:
        An object containing a base64 encoded email object.
    """
    message = MIMEMultipart()
    message['to'] = ', '.join(to)
    print(to, message['to'])
    message['cc'] = ', '.join(cc)
    message['from'] = sender
    message['subject'] = subject
    message.attach(MIMEText(message_text, 'plain'))

    # for file in attachments:
    #     part = MIMEBase('application', 'octet-stream')
    #     with open(file, 'rb') as f:
    #         part.set_payload(f.read())
    #     encoders.encode_base64(part)
    #     part.add_header('Content-Disposition', f'attachment; filename={os.path.basename(file)}')
    #     message.attach(part)
    
    # print(message)
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    # print(raw)
    return {'raw': raw}

def send_message(service, user_id, message):
    """Send an email message.

    Args:
        service: Authorized Gmail API service instance.
        user_id: User's email address. The special value "me"
        can be used to indicate the authenticated user.
        message: Message to be sent.

    Returns:
        Sent Message.
    """
    try:
        message = service.users().messages().send(userId=user_id, body=message).execute()
        print(f'Message Id: {message["id"]}')
        return message
    except HttpError as error:
        print(f'An error occurred: {error}')
        return None

def get_email_addresses(prompt):
    """Prompt the user for a list of email addresses."""
    email_addresses = []
    while True:
        email = input(prompt)
        if email:
            email_addresses.append(email)
        else:
            break
    return email_addresses

def get_file_paths(prompt):
    """Prompt the user for a list of file paths."""
    file_paths = []
    while True:
        file_path = input(prompt)
        if file_path:
            file_paths.append(file_path)
        else:
            break
    return file_paths

def main(access_token, to, cc, bcc, subject, message_text):
    """Shows basic usage of the Gmail API.
    Sends an email message.
    """
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)

    sender = 'tanishqcode7987@gmail.com'
    
    too = [to]
    # cc = ["tanishq.kurhade@gmail.com"]
    # bcc = ["samarthpawan@gmail.com"]
    attachments = ["./image.jpg"]
    # print("Access Token: ", access_token)

    message = create_message(sender, too, cc, bcc, subject, message_text, attachments)
    # print(message)
    send_message(service, 'me', message)

if __name__ == '__main__':
    import sys
    # if len(sys.argv) != 6:
    #     print("Usage: python3 gmail_send.py <access_token> <to> <subject> <body>")
    #     sys.exit(1)

    access_token = sys.argv[1]
    to = sys.argv[2]
    cc = sys.argv[3]
    bcc = sys.argv[4]
    subject = sys.argv[5]
    message_text = sys.argv[6]
    main(access_token, to, cc, bcc, subject, message_text)
