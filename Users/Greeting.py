'''
Created on Oct 21, 2010

'''

from google.appengine.ext import db
from google.appengine.api import users


class Greeting(db.Model):
    author = db.UserProperty()
    content = db.StringProperty(multiline=True)
    date = db.DateTimeProperty(auto_now_add=True)
    
    @staticmethod
    def GetGreeting():
            current_user = users.get_current_user()    
              
            greeting = ("%s (<a href=\"%s\">sign out</a>)" %(current_user.nickname(), users.create_logout_url("/")))
            return greeting