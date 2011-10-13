'''
Created on Mar 30, 2011

@author: jason
'''

from Map.BrowseTripHandler import BaseHandler

class NotificationHandler(BaseHandler):
    
    def get(self):
        self.syncdb.users.update({'user_id':self.current_user['user_id']},{'$unset':{'new_notifications':[]}})
        self.render('notification.html', custom_user = self.current_user)