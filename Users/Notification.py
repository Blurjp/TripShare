'''
Created on Mar 30, 2011

@author: jason
'''
import tornado.web
from Map.BrowseTripHandler import BaseHandler

class NotificationHandler(BaseHandler):
    
    def get(self):
        self.syncdb.users.update({'user_id':self.current_user['user_id']},{'$pullAll':{'new_notifications':[]}})
        self.render('notification.html', custom_user = self.current_user)
        
class NotificationGenerator(BaseHandler):
     
     def __init__(self,type):
         self.notification = {} 
         self.notification['user_name'] = self.current_user['user_name']
         self.notification['type'] = type
         self.notification['id'] = bson.ObjectId()