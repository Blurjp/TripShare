'''
Created on Mar 30, 2011

@author: jason
'''

from Map.BrowseTripHandler import BaseHandler

class NotificationHandler(BaseHandler):
    
    def get(self):
        self.render('notification.html')