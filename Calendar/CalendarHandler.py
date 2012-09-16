'''
Created on Sep 9, 2011

@author: jason
'''
from Map.BrowseTripHandler import BaseHandler
import tornado.web
import bson
import httplib2
import gflags
import tornado.ioloop
import MongoEncoder.MongoEncoder
import pickle
import simplejson
from datetime import datetime
import urllib


from apiclient.discovery import build
from oauth2client.file import Storage
from oauth2client.client import OAuth2WebServerFlow
from oauth2client.tools import run
from icalendar import Calendar, Event
#from icalendar import UTC

class ExportCalendarAsiCal(BaseHandler):
    
    @staticmethod
    def GenerateEvent(self, _event):
        cal = Calendar()
        cal.add('prodid', '-//My calendar product//mxm.dk//')
        cal.add('version', '2.0')
        
        event = Event()
        event.add('summary', _event['summary'])
        event.add('dtstart', datetime.strptime(_event['start']['date'], "%Y-%m-%d"))
        event.add('dtend', datetime.strptime(_event['end']['date'], "%Y-%m-%d"))
        event.add('priority', 1)
        cal.add_component(event)
        self.set_header ('Content-Type', 'text/calendar')
        self.set_header ('Content-Disposition', 'attachment; filename=myCalendar.ics')
        self.write(cal.as_string())
        self.finish()


class ExportCalendarHandler(BaseHandler):

    @tornado.web.asynchronous
    def google_handle_calendar_request(self, response):
        #print response.body
        res = simplejson.loads(response.body)
        if "access_token" in res:
            access_token = res['access_token']
            #print access_token
            user = self.syncdb.users.find_one({'user_id':bson.ObjectId(self.current_user['user_id'])})
            user['google_access_token'] = access_token
            if "refresh_token" in res:
               user['google_refresh_token'] = res["refresh_token"]
            self.syncdb.users.save(user)
            
            body = unicodedata.normalize('NFKD', self.current_user['temp_event']).encode('ascii','ignore')
            http_client = tornado.httpclient.AsyncHTTPClient()
            headers = {'Authorization':'Bearer '+access_token, 'X-JavaScript-User-Agent':  'Google APIs Explorer', 'Content-Type':  'application/json'}
            req = tornado.httpclient.HTTPRequest(url="https://www.googleapis.com/calendar/v3/calendars/primary/events?key="+self.settings["google_developer_key"],
                                             method="POST",
                                             body=body,
                                             headers=headers)
            http_client.fetch(req, callback=self.insert_event_response)
                
        
    def insert_event_response(self, response):
        
        response = simplejson.loads(response.body)
        if "status" in response and response['status'] == 'confirmed':
            self.redirect('/mytrips')
        else:
            self.redirect('/mytrips')


    def post(self):
        try:
            type = self.get_argument("type")
            trip_id = self.get_argument("trip_id")
            trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
            groups = trip['groups']
            self.title = trip['title']
            check = False
            self.location = ''
            self.attendees = []
            for index, group in enumerate(groups):
                if self.current_user in group['members']:
                    check = True
                    self.start = group[index]['start_date']
                    print group[index]
                    self.end = group[index]['finish_date']
                    for dest in groups[index]['dest_place']:
                        self.location += dest['dest']+';'
                    for member in group[index]['members']:
                        self.attendees.append({'email': member['email']})
                    break
                
            if check == False:
                self.start = groups[0]['start_date']
                self.end = groups[0]['finish_date']
                self.attendees.append(self.current_user['email'])
                for dest in groups[0]['dest_place']:
                        self.location += dest['dest']+';'
            
            event = {
             "title": "Trip: "+self.title,
             "summary": "Trip: "+self.title,
             "location": self.location,
             'start': {
                      'date': self.start
                      },
             'end':   {
                      'date': self.end
                      },
             
             'attendees': self.attendees,
             'etag': 'trip',
            }
            user = self.syncdb.users.find_one({'user_id':bson.ObjectId(self.current_user['user_id'])})
            
            user['temp_event'] = simplejson.dumps(event, cls=MongoEncoder.MongoEncoder.MongoEncoder)
            self.syncdb.users.save(user)
            
            if type == 'ical':
                ExportCalendarAsiCal.GenerateEvent(self, event)
                
            
            elif type == 'google': 
                
                if 'google_refresh_token' in self.current_user and self.current_user['google_refresh_token'] != '':
                    
                    post_args={
                              "refresh_token": self.current_user['google_refresh_token'],
                              "client_secret": self.settings["google_client_secret"],
                              "client_id": self.settings["google_client_id"],
                              "grant_type": "refresh_token",
                              }
                    http_client = tornado.httpclient.AsyncHTTPClient()
                    http_client.fetch("https://accounts.google.com/o/oauth2/token",
                                           method="POST",
                                           body=urllib.urlencode(post_args),
                                           callback=self.async_callback(self.google_handle_calendar_request))

                else:
                    client_id=self.settings["google_client_id"]
                    scope='https://www.googleapis.com/auth/calendar' 
                    #redirect_uri = 'http://www.tripshare.cc/oauth2callback'
                    redirect_uri = (self.request.protocol + "://" + self.request.host +
                    "/calendar_oauth2callback")
                    
                    args={
                          "scope": scope,
                          "redirect_uri": redirect_uri,
                          "response_type": "code",
                          "client_id": client_id,
                          "access_type": "offline",
                          }
                    
                    self.redirect("https://accounts.google.com/o/oauth2/auth?"+ urllib.urlencode(args))


        except Exception, err:
                print "calendar export error: " + str(err)
