# BITSY
![Language](https://img.shields.io/badge/Language-Python-428F7E?style=flat-square)
![Language](https://img.shields.io/badge/Language-HTML%2FCSS-E34F26?style=flat-square)
![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=flat-square)
![Language](https://img.shields.io/badge/Language-MongoDB-4DB33D?style=flat-square)
![Language](https://img.shields.io/badge/Language-React.JS-61DAFB?style=flat-square)
![Model](https://img.shields.io/badge/Model-Ai_Assistant-ffffff?style=flat-square)
![Model](https://img.shields.io/badge/Model-LLM-5123Df?style=flat-square)
![Model](https://img.shields.io/badge/Model-OpenAI-5183CA?style=flat-square)





![BITSY Logo](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/main/email-assistant/LOGO.png?raw=true)


Welcome to BITSY Your Personal AI Assistant! 

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Troubleshooting](#troubleshooting)
- [CodeDocumentation](#codedocumentation)
- [Acknowledgement](#acknowledgement)
- [Contact](#Contact)

## Introduction

BITSY is an innovative project for Microsoft's AI Hackathon 2024 aimed at providing the user Multiple features like schedule tasks, manage calendars, provide reminders, and answer queries.

## Features
![login](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/a30444402bb8ae3181f44280d55380417f9946ce/email-assistant/Login%20Page.jpeg)

![WhiteDB](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/4b97573d1709c9be0f30b8787fc27531e832d849/email-assistant/LightMode%20Dashboard.jpeg)

![DarkDB](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/4b97573d1709c9be0f30b8787fc27531e832d849/email-assistant/DarkMode%20Dashboard.jpeg)

![Email](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/4b97573d1709c9be0f30b8787fc27531e832d849/email-assistant/EmailTracker.jpeg)

![Nutrition](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/4b97573d1709c9be0f30b8787fc27531e832d849/email-assistant/NutritionTracker.jpeg)

![Calender](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/4b97573d1709c9be0f30b8787fc27531e832d849/email-assistant/CalenderSchedule.jpeg)

![Chat](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/4b97573d1709c9be0f30b8787fc27531e832d849/email-assistant/Chat.jpeg)

![Todo](https://github.com/Samarth-Pawan/Personal_AI-Assistant/blob/1578c39c97a59091a61fc91e4cdec85eee1675cf/email-assistant/Todo.jpeg)

- Calendar scheduling using Google Calendar
    - Prints out the upcoming Events along with its date and time
    - Allows users to make a Custom Event:
        - Enter Summary <subject of event>
        - Enter Description of event
        - Enter Start time of event 
        - Enter duration of event
        - Enter emails of attendees to Event {A reminder mail will automatically be sent to them on their Email ID}

- ToDo List
    - Allows user input Tasks
    - Keeps Track of ongoing Tasks
    - Keeps Track of completed Tasks

- Send Emails using Gmail
    - Can send mails to multiple Users
    - Assign Multiple Users to be CC <carbon copy> and BCC<Blind Carbon Copy>
    - Allow User to input custom Heading and Message Body
    - Send Images ,Videos ,Documents etc.  as an attachment file

- General Chat
    - Allows users to give simple Queries
    - Utilizes a language model (LLM) to provide answers, suggestions, and information to user queries


- Nutrition Tracker 
    - Provides Macros information:
        - Carbohydrates
        -  Fat
        - Protein
    - Allows user to track their nutrition calorie content





## Installation

To install BITSY, follow these steps:
Need to setup frontendm backend as well as python(Mix folders

1. Clone the repository:
    ```bash
    git clone https://github.com/Samarth-Pawan/Personal_AI-Assistant.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Personal_AI-Assistant
    cd email-assistant
    ```
3. Install the necessary dependencies for frontend:
    ```bash
    cd my-email-assistant
    npm install
    npm run dev

4. Install the necessary dependencies for backend:
    ```bash
    cd backend
    npm init -y
    npm install
    npm start

5. Install the necessary packages in Msoft-sam-tinku using pip for python connection with calendar and email api's:
    ```bash
    pip install google-auth google-auth-oauthlib google-api-python-client httplib2 oauth2client beautifulsoup4 python-dateutil
6. Alternatively you can execute this in Msoft-sam-tinku folder which will automatically install necessary python libraries. Path of requirements.txt is as follows:
    ```bash
    pip install -r requirements.txt







### STEPS TO FOLLOW AFTER INSTALLATION
Now you can run the program locally
1. On the Login Page give your API Key to access the OpenAI model:
2. Once done choose any one of the Features you want to explore
3. For using of Email or Calendar API , since they use Google API you may need to authorize the account , you will be prompted to a google API window choose the email ID given below (tanishqcode7987@gmail.com) and click on authorize and select both gmail and calendar options when prompted once done you will see a message that you can close the application

Since we are using an Internal Google Server you can use these Following Credentials to test our product on this dummy account.
- Email ID: tanishqcode7987@gmail.com

- Password : LiteCooder

## Troubleshooting
incase If program gives you an error you can try these troubleshooting techniques 
* Since we are running this on a Free Google Cloud ,Incase if you use our dummy email, even though we have disabled our 2Fa for our account. On the account of Google's rules and policies you may need to perform a authentication procedure by selecting a number , you can contact one of us for the authentication procedure
* Delete the token file in your repository and run the program again for mail and calendar features
* Try to open the console to check the error log for any discrepancy
* Feel free to contact anyone of us for any problem



## CodeDocumentation



Here's a brief example of how BITSY Code Works:



This is used to define the Scopes or the access control that the gmail and calendar API gets to use in out project to allow it to use Read and Write Permissions
```bash
PYTHON:
    #SCOPES AND ACCESS CONTORL FOR GMAIL AND CALENDAR API
    SCOPES = ['https://www.googleapis.com/auth/calendar','https://mail.google.com/']
```


This is used to Create A temporary Token that allows the Program to Call the GSuite Api and allow access to its features using the internal google cloud service
```bash
PYTHON:
    #CREATION OF TEMP TOKEN 

    # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  # If there are no (valid) credentials available, let the user log in.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
      token.write(creds.to_json())
```


This is used to Create Credentials for a user and the specific program he is trying to use , this code is used in all GSuite Applications and it needs to be run once and it will create a Credential.json file that allows user to use the project features
```bash
PYTHON:

def get_credentials():
    #Gets valid user credentials from storage.
    
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
```


This Function is used to create a Mail that can be sent over Gmail where the user gets to customly send to,CC,BCC and subject along with it's body
```bash
PYTHON:

def create_message(sender, to, cc, bcc, subject, message_text, attachments):
    #Create a message for an email.
    message = MIMEMultipart()
    message['to'] = ', '.join(to)
    message['cc'] = ', '.join(cc)
    message['from'] = sender
    message['subject'] = subject
    message.attach(MIMEText(message_text, 'plain'))

    for file in attachments:
        part = MIMEBase('application', 'octet-stream')
        with open(file, 'rb') as f:
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={os.path.basename(file)}')
        message.attach(part)
    
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw}
```

This code intitates the GMAIL API to send the user defined Mail
```bash
PYTHON:

def send_message(service, user_id, message):
    #Send an email message.
    try:
        message = service.users().messages().send(userId=user_id, body=message).execute()
        print(f'Message Id: {message["id"]}')
        return message
    except HttpError as error:
        print(f'An error occurred: {error}')
    return None
```
This code is used to check all the unread messages from the user's inbox and stores them in a CSV file along with the information of sender message subject and message body
```bash
PYTHON:

    # Getting all the unread messages from Inbox
def parse_message(service, user_id, msg_id):
    message = service.users().messages().get(userId=user_id, id=msg_id).execute()
    payload = message.get('payload', {})
    headers = payload.get('headers', [])
    
    msg_data = {}
    for header in headers:
        name, value = header.get('name'), header.get('value')
        if name == 'Subject':
            msg_data['Subject'] = value
        elif name == 'Date':
            msg_data['Date'] = str(parser.parse(value).date())
        elif name == 'From':
            msg_data['Sender'] = value

    msg_data['Snippet'] = message.get('snippet')
    
    parts = payload.get('parts', [])
    if parts:
        part_data = parts[0]['body'].get('data', '')
        clean_data = base64.urlsafe_b64decode(part_data.encode('UTF-8'))
        soup = BeautifulSoup(clean_data, "lxml")
        msg_data['Message_body'] = soup.body()
    
    return msg_data

```

This code is used to get the information of the upcoming events where the user enters how many event details he wants to know and the code will tell him the date and time for upcoming events, in our dummy email he is reminded to code everyday 

```bash
PYTHON:

def get_upcoming_events(service, num_events):
    now = datetime.datetime.utcnow().isoformat() + "Z"
    print(f"Getting the upcoming {num_events} events")
    events_result = service.events().list(
        calendarId="primary",
        timeMin=now,
        maxResults=num_events,
        singleEvents=True,
        orderBy="startTime",
    ).execute()
    return events_result.get("items", [])
```

This code is used to create a custom Event in a callender where the user can specify the event name,time,duration,description and also the attendees that plan on attending the event it will also send the attendees and email for the email reminder
```bash
PYTHON:
    
def create_event(calendar_service, gmail_service, calendar_id, summary, description, start_time, end_time, attendees):
    """Create an event in the specified calendar and send email notifications."""
    timeZone = 'Asia/Kolkata' #timezone for event
    event_request_body = {
        'start': {#start time of event
            'dateTime': start_time.strftime("%Y-%m-%dT%H:%M:%S"),
            'timeZone': timeZone,
        },
        'end': {
            'dateTime': end_time.strftime("%Y-%m-%dT%H:%M:%S"),
            'timeZone': timeZone
        },
        'summary': summary,         #title of event
        'description': description, #description of event
        'colorId': 5,
        'status': 'confirmed',
        'transparency': 'opaque',
        'visibility': 'private',
        'location': 'Thane, Viviana',   #loaction of event
        'attendees': attendees
    }
    response = calendar_service.events().insert(
        calendarId=calendar_id,
        body=event_request_body,
        sendUpdates='all'
    ).execute()
    print('Event created: %s' % response.get('htmlLink'))
    # Send email notifications to attendees
    for attendee in attendees:
        message = create_message(attendee['email'], summary, description)
        send_message(gmail_service, 'me', message)

```

This code is used to Manage chat messages state and provides functions to add and clear messages,in  the local storage.
```bash
ReactJS:

import React, { createContext, useState, useEffect } from "react";

// Create the ChatContext
const ChatContext = createContext();

// Define the ChatProvider component
export const ChatProvider = ({ children }) => {
  // Initialize state with messages from local storage or an empty array
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  // Update local storage whenever messages change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Function to add a new message
  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Function to clear all messages
  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;


```
This code is basically used to give the user an http client link that has been authorized with the credentials.json file
```bash
PYTHON:

def authorized_http(credentials):
    #Returns an http client that is authorized with the given credentials.


    from googleapiclient.http import build_http

    if HAS_GOOGLE_AUTH and isinstance(credentials, google.auth.credentials.Credentials):
        if google_auth_httplib2 is None:
            raise ValueError(
                "Credentials from google.auth specified, but "
                "google-api-python-client is unable to use these credentials "
                "unless google-auth-httplib2 is installed. Please install "
                "google-auth-httplib2."
            )
        return google_auth_httplib2.AuthorizedHttp(credentials, http=build_http())
    else:
        return credentials.authorize(build_http())
```



## Acknowledgement

* This project was undertaken in collaboration with Microsoft's AI Hackathon 2024. 
* Through this initiative, we gained valuable exposure to the hackathon environment, where we developed our technical skills in several key areas.
* Our technical stack included:
    * Frontend:Utilized React.JS with Vite for a dynamic and responsive user interface.
    * Backend: Employed Node.js and Express.js for robust server-side operations.
    * Database: Integrated MongoDB for efficient and scalable data management.
    * Styling: Applied Chakra UI to enhance the visual appeal of the application.
    * API Integration: Used Python for interacting with Google Suite APIs, including Gmail API and Google Calendar API.
* We also acquired essential skills such as effective teamwork, managing and delivering a high-quality project within a tight deadline, utilizing Git and GitHub for version control and collaboration, and Properly documenting our code.


* ### Resources
    * https://developers.google.com/gmail/api/guides
    * https://console.cloud.google.com/apis/dashboard?authuser=1&project=silent-thunder-426305-p5
    * https://microsoft.acehacker.com/hackathon/
## Contact

Please Feel Free to contact the creators for any further help
### Tanishq Kurhade :
- Personal Email: tanishq.kurhade@gmail.com
- College Email: f20220208@hyderabad.bits-pilani.ac.in
- Phone number: +91-9021349323
- Linkedin Id: https://www.linkedin.com/in/tanishq-kurhade-417750257/

### Samarth Pawan :
- Personal Email: samarthpawan@gmail.com
- College Email: f20220091@hyderabad.bits-pilani.ac.in
- Phone number: +91-9008814458
- Linkedin Id: https://www.linkedin.com/in/samarth--pawan/

