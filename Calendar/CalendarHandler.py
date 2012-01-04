'''
Created on Sep 9, 2011

@author: jason
'''
from Map.BrowseTripHandler import BaseHandler
import tornado.web
import bson
import httplib2

from apiclient.discovery import build
from oauth2client.file import Storage
from oauth2client.client import OAuth2WebServerFlow
from oauth2client.tools import run

class ExportCalendarHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        
        type = self.get_argument("type")
        trip_id = self.get_argument("trip_id")
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        groups = trip['groups']
        title = trip['title']
        check = False
        location = ''
        attendees = []
        for index, group in enumerate(groups):
            if self.current_user in group['members']:
                check = True
                start = group[index]['start_date']
                end = group[index]['end_date']
                for dest in groups[index]['dest_place']:
                    location += dest['dest']+';'
                for member in group[index]['members']:
                    attendees.append({'email': member['email']})
                break
            
        if check == False:
            start = groups[0]['start_date']
            end = groups[0]['finish_date']
            attendees.append(self.current_user['email'])
            for dest in groups[0]['dest_place']:
                    location += dest['dest']+';'

        if type == 'google': 
            
            #FLAGS = gflags.FLAGS
# Set up a Flow object to be used if we need to authenticate. This
# sample uses OAuth 2.0, and we set up the OAuth2WebServerFlow with
# the information it needs to authenticate. Note that it is called
# the Web Server Flow, but it can also handle the flow for native
# applications
# The client_id and client_secret are copied from the API Access tab on
# the Google APIs Console
            FLOW = OAuth2WebServerFlow(
            client_id='1072071824058.apps.googleusercontent.com',
            client_secret='Zh1EiK8GTXiDObnzEKEmm02h',
            scope='https://www.googleapis.com/auth/calendar',
            user_agent='tripshare/1.0')

# To disable the local server feature, uncomment the following line:
# FLAGS.auth_local_webserver = False

# If the Credentials don't exist or are invalid, run through the native client
# flow. The Storage object will ensure that if successful the good
# Credentials will get written back to a file.
            storage = Storage('calendar.dat')
            credentials = storage.get()
            if credentials is None or credentials.invalid == True:
                credentials = run(FLOW, storage)

# Create an httplib2.Http object to handle our HTTP requests and authorize it
# with our good Credentials.
            http = httplib2.Http()
            http = credentials.authorize(http)

# Build a service object for interacting with the API. Visit
# the Google APIs Console
# to get a developerKey for your own application.
            service = build(serviceName='calendar', version='v3', http=http,
            developerKey='AIzaSyCjWwQX-D4UMDRVcoLaxZGaeU_76tMIKNA')
            event = {
                 "summary": "Trip: "+title,
                 "location": location,
                 'start': {
                          'dateTime': start
                          },
                 'end':   {
                          'dateTime': end
                          },
                 'attendees': attendees,
                }

            created_event = service.events().insert(calendarId='primary', body=event).execute()
            print created_event['id']
        