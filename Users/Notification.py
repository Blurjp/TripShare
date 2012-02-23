'''
Created on Mar 30, 2011

@author: jason
'''
import bson
from Map.BrowseTripHandler import BaseHandler

class NotificationHandler(BaseHandler):
    
    def get(self):
        self.syncdb.users.update({'user_id':self.current_user['user_id']},{'$set':{'new_notifications':[]}})
        self.render('notification.html', custom_user = self.current_user)
        
class NotificationGenerator():
     
    def __init__(self, type, username, slug, picture, time, user_id):
         
        self.notification = {} 
        self.notification['username'] = username
        self.notification['slug'] = slug
        self.notification['type'] = type
        self.notification['user_id'] = user_id
        self.notification['picture'] = picture
        self.notification['id'] = bson.ObjectId()
        self.notification['created'] = time
        
class ExpenseNotificationGenerator():
     
    def __init__(self, type, username, slug, picture, time, user_id, expense):
         
        self.notification = {} 
        self.notification['username'] = username
        self.notification['slug'] = slug
        self.notification['type'] = type
        self.notification['user_id'] = user_id
        self.notification['picture'] = picture
        self.notification['id'] = bson.ObjectId()
        self.notification['created'] = time
        self.notification['expense'] = expense