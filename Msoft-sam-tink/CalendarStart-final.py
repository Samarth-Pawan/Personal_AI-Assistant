import datetime
import os.path
import sys  # Added for command line arguments

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import json  # Added to return JSON response

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://mail.google.com/']

def main(num_events):
    """Fetches the upcoming 'num_events' events from the user's calendar."""
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Failed to refresh token: {e}")
                creds = None
        if not creds:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("calendar", "v3", credentials=creds)

        # Call the Calendar API
        now = datetime.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
        # print(f"Getting the upcoming {num_events} events")
        events_result = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=now,
                maxResults=num_events,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        events = events_result.get("items", [])

        if not events:
            print("No upcoming events found.")
            return {"success": False, "message": "No upcoming events found."}

        # Prepare the list of events to return
        # upcoming_events = []
        # for event in events:
        #     start = event["start"].get("dateTime", event["start"].get("date"))
        #     upcoming_events.append({
        #         "start": start,
        #         "summary": event["summary"]
        #     })

        # return json.dumps({"success": True, "events": upcoming_events})

        upcoming_events = []
        for event in events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            attendees = event.get("attendees", [])
            description = event.get("description", "")
            upcoming_events.append({
                "start": start,
                "summary": event["summary"],
                "attendees": attendees,
                "description": description
            })

        # Print the JSON response
        return json.dumps({"success": True, "events": upcoming_events})

    except HttpError as error:
        print(f"An error occurred: {error}")
        if error.resp.status in [400, 401, 403]:
            return {"success": False, "message": "Invalid credentials or insufficient permissions."}
        elif error.resp.status == 404:
            return {"success": False, "message": "The requested resource was not found."}
        else:
            return {"success": False, "message": "An unexpected error occurred. Please try again."}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python CalendarStart.py <num_events>")
        sys.exit(1)
    
    num_events = int(sys.argv[1])
    result = main(num_events)
    print(result)
