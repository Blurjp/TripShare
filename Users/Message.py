'''
Created on Mar 30, 2011

@author: jason
'''
import Users
import simplejson
import datetime
import bson
import tornado.web
from Map.BrowseTripHandler import BaseHandler

class MessageHandler(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        self.db.users.find_one({'user_id': self.current_user.user_id}, callback=self._on_response)
        # or
        # conn = self.db.connection(collectionname="...", dbname="...")
        # conn.find(..., callback=self._on_response)

    def _on_response(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        self.render('message.html', messages=response["messages"])
        
        
class PostMessageHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        message = self.get_argument('message')
        #print(self.get_argument('slugs'))
        slugs = simplejson.loads(self.get_argument('slugs'))
        
        _notification = Users.Notification.MessageNotificationGenerator('message_request', self.current_user['username'], self.current_user['slug'], self.current_user['picture'], datetime.datetime.utcnow(), self.current_user['user_id'], message)
        for user_slug in slugs['slugs']:
            print(user_slug)
            self.syncdb.users.update({'slug':user_slug}, {'$addToSet':{'new_notifications':_notification.notification}})
            self.syncdb.users.update({'slug':user_slug}, {'$addToSet':{'notifications':_notification.notification}})
            self.syncdb.users.update({'slug':user_slug}, {'$addToSet':{'message_request_receive':message}})
            self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'message_send':message}})
