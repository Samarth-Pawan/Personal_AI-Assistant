import os
import re
import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from googleapiclient.errors import HttpError

# Define the scopes
SCOPES = ['https://www.googleapis.com/auth/calendar','https://mail.google.com/']

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

def is_valid_email(email):
    """Validate email address."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def get_event_details():
    """Get event details from the user."""
    summary = input("Enter the event summary: ")
    description = input("Enter the event description: ")
    
    while True:
        start_time_str = input("Enter the event start time (YYYY-MM-DD HH:MM): ")
        try:
            start_time = datetime.datetime.strptime(start_time_str, "%Y-%m-%d %H:%M")
            break
        except ValueError:
            print("Invalid format. Please enter the date and time in 'YYYY-MM-DD HH:MM' format.")
    
    duration_hours = int(input("Enter the event duration in hours: "))
    end_time = start_time + datetime.timedelta(hours=duration_hours)
    
    return summary, description, start_time, end_time

def get_attendees(attendees=None):
    """Recursively get attendees."""
    if attendees is None:
        attendees = []
    
    email = input("Enter attendee email (or press Enter to finish): ")
    if not email:
        return attendees
    
    if is_valid_email(email):
        attendee = {
            'displayName': email.split('@')[0],  # Using the part before '@' as the display name
            'email': email,
            'responseStatus': 'needsAction'  # Default status
        }
        attendees.append(attendee)
    else:
        print(f"Invalid email address: {email}. Please try again.")
    
    return get_attendees(attendees)

def create_event(service, calendar_id, summary, description, start_time, end_time, attendees):
    """Create an event in the specified calendar."""
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
        'summary': summary,
        'description': description,
        'colorId': 5,
        'status': 'confirmed',
        'transparency': 'opaque',
        'visibility': 'private',
        'location': 'Thane, Viviana',
        'attendees': attendees
    }
    
    response = service.events().insert(
        calendarId=calendar_id,
        body=event_request_body,
        sendUpdates='all'
    ).execute()
    
    print('Event created: %s' % response.get('htmlLink'))

def main():
    service = create_service()
    calendar_id = 'primary'  # Use the primary calendar
    summary, description, start_time, end_time = get_event_details()
    attendees = get_attendees()
    create_event(service, calendar_id, summary, description, start_time, end_time, attendees)

if __name__ == "__main__":
    main()
