'''
Created on Mar 30, 2011

@author: jason
'''
import Users
import simplejson
import datetime
import bson
import tornado.web
from Auth.AuthHandler import ajax_login_authentication
from Map.BrowseTripHandler import BaseHandler

class MessageHandler(BaseHandler):
    
    def Send(self, source_id, dest_id, message, type):
           user = self.syncdb.users.find_one({"user_id": bson.ObjectId(source_id)})
           _notification = Users.Notification.MessageNotificationGenerator(type, user['username'], user['slug'], user['picture'], datetime.datetime.utcnow(), user['user_id'], message)
        
           self.syncdb.users.update({'user_id':bson.ObjectId(dest_id)}, {'$addToSet':{'new_notifications':_notification.notification}})
           self.syncdb.users.update({'user_id':bson.ObjectId(dest_id)}, {'$addToSet':{'notifications':_notification.notification}})
           self.syncdb.users.update({'user_id':bson.ObjectId(dest_id)}, {'$addToSet':{'message_request_receive':message}})
           if type != 'system_message':
               self.syncdb.users.update({'user_id':bson.ObjectId(source_id)}, {'$addToSet':{'message_send':message}})
        
class PostMessageHandler(BaseHandler):
    @ajax_login_authentication
    def post(self):
        message = self.get_argument('message')
        
        slugs = simplejson.loads(self.get_argument('slugs'))
        
        _notification = Users.Notification.MessageNotificationGenerator('message_request', self.current_user['username'], self.current_user['slug'], self.current_user['picture'], datetime.datetime.utcnow(), self.current_user['user_id'], message)
        for user_slug in slugs['slugs']:
            
            self.syncdb.users.update({'slug':user_slug}, {'$addToSet':{'new_notifications':_notification.notification}})
            self.syncdb.users.update({'slug':user_slug}, {'$addToSet':{'notifications':_notification.notification}})
            self.syncdb.users.update({'slug':user_slug}, {'$addToSet':{'message_request_receive':message}})
            self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'message_send':message}})

