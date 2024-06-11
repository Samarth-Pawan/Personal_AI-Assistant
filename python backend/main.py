import os
import base64
import requests
from ms_graph import generate_access_token

def draft_attachment(file_path):
    if not os.path.exists(file_path):
        print(f'File not found: {file_path}')
        return None
    
    with open(file_path, 'rb') as upload:
        media_content = base64.b64encode(upload.read())
        
    data_body = {
        '@odata.type': '#microsoft.graph.fileAttachment',
        'contentBytes': media_content.decode('utf-8'),
        'name': os.path.basename(file_path)
    }
    return data_body

APP_ID = '2cc70e71-0322-455e-9962-84ec3bb5ef00'
SCOPES = ['Mail.Send', 'Mail.ReadWrite']

access_token = generate_access_token(app_id=APP_ID, scopes=SCOPES)
headers = {
    'Authorization': 'Bearer ' + access_token['access_token'],
    'Content-Type': 'application/json'
}

attachments = [draft_attachment('hello.txt'), draft_attachment('image.png')]
attachments = [attachment for attachment in attachments if attachment is not None]

request_body = {
    'message': {
        # recipient list
        'toRecipients': [
            {
                'emailAddress': {
                    'address': 'f20220208@hyderabad.bits-pilani.ac.in'
                }
            }
        ],
        # email subject
        'subject': 'You got an email',
        'importance': 'normal',
        'body': {
            'contentType': 'HTML',
            'content': '<b>Be Awesome</b>'
        },
        # include attachments
        'attachments': attachments
    }
}

GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0'
endpoint = GRAPH_ENDPOINT + '/me/sendMail'

response = requests.post(endpoint, headers=headers, json=request_body)
if response.status_code == 202:
    print('Email sent')
else:
    print(f"Failed to send email: {response.status_code} {response.reason}")
    print(response.text)
