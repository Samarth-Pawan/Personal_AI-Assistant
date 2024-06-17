import os
import re
import datetime
import sys  # Added for command line arguments
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from googleapiclient.errors import HttpError

# Define the scopes
SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://mail.google.com/']


def create_service():
    """Authenticate and create the Google Calendar service."""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                '/Users/samarthpawan/Documents/Personal_AI-Assistant/Msoft-sam-tink/credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    service = build('calendar', 'v3', credentials=creds)
    return service

def get_attendees(attendees_data):
    """Parse attendees data from frontend."""
    attendees = []
    for attendee_email in attendees_data:
        if is_valid_email(attendee_email):
            attendee = {
                'displayName': attendee_email.split('@')[0],  # Using the part before '@' as the display name
                'email': attendee_email,
                'responseStatus': 'needsAction'  # Default status
            }
            attendees.append(attendee)
        else:
            print(f"Invalid email address: {attendee_email}. Skipping.")
    return attendees


def is_valid_email(email):
    """Validate email address."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def create_event(service, calendar_id, summary, description, start_time, duration_hours, attendees):
    """Create an event in the specified calendar."""
    timeZone = 'Asia/Kolkata'

    end_time = start_time + datetime.timedelta(hours=duration_hours)

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
    # Extract command line arguments
    summary = sys.argv[1]
    description = sys.argv[2]
    start_time_str = sys.argv[3]
    duration_hours = int(sys.argv[4])
    attendees = sys.argv[5].split(',')
    attendees = [attendee.strip() for attendee in attendees]
    # summary = "Sample Event"
    # description = "This is a dummy event description."
    # start_time_str = "2024-06-17 15:00"
    # duration_hours = 2
    # attendees = ["samarthpawan@gmail.com", "tanishq.kurhade@gmail.com"]
    final_attendees = get_attendees(attendees_data=attendees)
    print(attendees)

    try:
        start_time = datetime.datetime.strptime(start_time_str, "%Y-%m-%d %H:%M")
    except ValueError:
        print("Invalid format. Please enter the date and time in 'YYYY-MM-DD HH:MM' format.")
        return

    service = create_service()
    calendar_id = 'primary'  # Use the primary calendar
    create_event(service, calendar_id, summary, description, start_time, duration_hours, final_attendees)


if __name__ == "__main__":
    main()
