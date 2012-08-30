import tornado.auth
import Users
import bson
import datetime
from Map.BrowseTripHandler import BaseHandler
from Auth.AuthHandler import ajax_login_authentication
from Users.Message import MessageHandler
from pymongo.errors import InvalidId

class TripShareInviteHandler(MessageHandler):
    def post(self):
        trip_id = self.get_argument('trip_id')
        
        group_ids = self.get_argument('group_ids')
        
        _group_ids = group_ids.split('test')
        
        for p in _group_ids:
            if p!='':
                trip = self.syncdb.trips.find_one({"trip_id": bson.ObjectId(trip_id)})
                self.Send(self.current_user['user_id'],p,trip['slug'],'trip_request')
            
#    def Send(self, user_id, trip_id):
#        
#        user = self.syncdb.users.find_one({"user_id": bson.ObjectId(user_id)})
#        trip = self.syncdb.trips.find_one({"trip_id": bson.ObjectId(trip_id)})
#        
#        _notification = Users.Notification.MessageNotificationGenerator('trip_request', user['username'], user['slug'], user['picture'], datetime.datetime.utcnow(), user['user_id'], trip['slug'])
#        
#            
#        self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$addToSet':{'new_notifications':_notification.notification}})
#        self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$addToSet':{'notifications':_notification.notification}})
#        self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$addToSet':{'message_request_receive':trip['slug']}})
#        self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'message_send':trip['slug']}})


class FaceBookInviteHandler(BaseHandler, tornado.auth.FacebookGraphMixin):
    @tornado.web.asynchronous
    def post(self):
        trip_id = self.get_argument('trip_id')
        
        if trip_id!='':
            trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
            message = self.current_user['username']+" ask you to join the trip: "+ trip['title'] +" in TripShare!"
        else:
            message = "Try TripShare, the tool for group travelers!"
       
        group_ids = self.get_argument('group_ids')
        
        _group_ids = group_ids.split('test')

        for index, p in enumerate(_group_ids):
            if "access_token" in self.current_user: self.facebook_request(
                "/"+p+"/apprequests",
                post_args={"message":message},
                access_token=self.current_user["access_token"],
                callback=self.async_callback(self._on_post))
        else:
            self.write("failed")
            self.finish()
    
    def _on_post(self, new_entry):
        if not new_entry:
            print "call failed"
            # Call failed; perhaps missing permission?
            #self.authorize_redirect()
            #return
        self.redirect(self.get_argument("next", "/"))
            
class FaceBookGetFriendsHandler(BaseHandler, tornado.auth.FacebookGraphMixin):
    @tornado.web.asynchronous
    def get(self):
        
        if "access_token" in self.current_user:
        
            self.facebook_request(
                "/me/friends",
                access_token=self.current_user["access_token"],
                fields = "name,picture",
                callback=self.async_callback(self._on_get))
        else:
            self.write("failed")
            self.finish()
            
    def _on_get(self, new_entry):
        if not new_entry:
            print "call failed"
            # Call failed; perhaps missing permission?
            self.authorize_redirect()
            return
        
        
        user = self.syncdb.users.find_one({"slug":self.current_user['slug']})
        
        if 'facebook_friends' not in user:
            user['facebook_friends'] = []
        
        for p in  new_entry['data']:
            #print p
            if p not in user['facebook_friends']:
                user['facebook_friends'].append(p)
        self.syncdb.users.save(user)
        self.redirect(self.get_argument("next", "/"))
        
        
class FaceBookPostHandler(BaseHandler, tornado.auth.FacebookGraphMixin):
    
    @tornado.web.asynchronous
    def post(self):
        
        if "access_token" in self.current_user:
        #print self.current_user["access_token"]
            content = self.get_argument("invite_text")
            self.facebook_request(
                "/me/feed",
                post_args={"message": content},
                access_token=self.current_user["access_token"],
                callback=self.async_callback(self._on_post))
        else:
            self.redirect("/auth/fblogin")

    def _on_post(self, new_entry):
        if not new_entry:
            print "call failed"
            # Call failed; perhaps missing permission?
            self.authorize_redirect()
            return
        self.redirect(self.get_argument("next", "/"))
        

class TwitterPostHandler(BaseHandler, tornado.auth.TwitterMixin):
    
    @tornado.web.asynchronous
    def post(self):
        if "tw_access_token" in self.current_user:
            content = self.get_argument("invite_text")
            #print self.current_user["access_token"]
            self.twitter_request(
                "/statuses/update",
                post_args={"status": content},
                access_token=self.current_user["tw_access_token"],
                callback=self.async_callback(self._on_post))
        else:
            
            self.authorize_redirect('/auth/twlogin')

    def _on_post(self, new_entry):
        if not new_entry:
            # Call failed; perhaps missing permission?
            self.authorize_redirect()
            return
        self.redirect(self.get_argument("next", "/"))
        
        
class GooglePostHandler(tornado.web.RequestHandler,
                  tornado.auth.TwitterMixin):
    
    @tornado.web.asynchronous
    def post(self):
        content = self.get_argument("invite_text")
        self.google_request(
            "/statuses/update",
            post_args={"status": content},
            access_token=self.current_user["access_token"],
            callback=self.async_callback(self._on_post))

    def _on_post(self, new_entry):
        if not new_entry:
            # Call failed; perhaps missing permission?
            self.authorize_redirect()
            return
        self.finish("Posted a message!")