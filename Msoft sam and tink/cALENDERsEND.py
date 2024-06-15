import datetime
import datetime
import os.path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


# Define the scopes
SCOPES = ['https://www.googleapis.com/auth/calendar']

def create_service():
    """Authenticate and create the Google Calendar service."""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    service = build('calendar', 'v3', credentials=creds)
    return service

def create_calendar(service):
    """Create a new calendar."""
    request_body = {
        'summary': 'Project Track',
        'timeZone': 'Asia/Kolkata'
    }
    response = service.calendars().insert(body=request_body).execute()
    print('Calendar created: %s' % response['id'])
    return response['id']

def create_event(service, calendar_id):
    """Create an event in the specified calendar."""
    start_time = datetime.datetime(2024, 6, 15, 16, 30, 0)  # Example start time
    end_time = start_time + datetime.timedelta(hours=2)
    timeZone = 'Asia/Kolkata'
    
    event_request_body = {
        'start': {
            'dateTime': start_time.strftime("%Y-%m-%dT%H:%M:%S"),
            'timeZone': timeZone,
        },
        'end': {
            'dateTime': end_time.strftime("%Y-%m-%dT%H:%M:%S"),
            'timeZone': timeZone
        },
        'summary': 'Project Meet',
        'description': 'Discussion of the Hackathon project',
        'colorId': 5,
        'status': 'confirmed',
        'transparency': 'opaque',
        'visibility': 'private',
        'location': 'Thane, Viviana',
        'attendees': [
            {
                'displayName': 'Tanishq',
                'comment': 'HACKATHON TEST',
                'email': 'vijay.kurhade@gmail.com',
                'optional': False,
                'organizer': True,
                'responseStatus': 'accepted'
            }
        ]
    }
    
    response = service.events().insert(
        calendarId=calendar_id,
        body=event_request_body,
        sendUpdates='all'
    ).execute()
    
    print('Event created: %s' % response.get('htmlLink'))

def main():
    service = create_service()
    calendar_id = create_calendar(service)
    create_event(service, calendar_id)

if __name__ == "__main__":
    main()
