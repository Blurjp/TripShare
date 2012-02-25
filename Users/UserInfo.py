'''
Created on Oct 20, 2010

@author: Jason Huang
'''

import simplejson
import bson
import StringIO
import pymongo
import datetime
import tornado.web
import MongoEncoder.MongoEncoder
import Users.Notification
import Users.Friend
from Map.BrowseTripHandler import BaseHandler
from boto.s3.connection import S3Connection
from boto.s3.key import Key

try:
  from PIL import Image
except ImportError:
  try:
    import Image
  except ImportError:
     print('To use ImageFields, you need to install the Python Imaging Library. Get it at http://www.pythonware.com/products/pil/ .')

import sys
def percent_cb(complete, total):
    sys.stdout.write('.')
    sys.stdout.flush()




class TravelersHandler(BaseHandler):
    user = None
    @tornado.web.asynchronous
    def get(self, type):

        if (type == '' or type == 'friends'):
                self.db.users.find(sort = [('trips.count()', -1)], callback=self._people_entry)
        elif (type == 'active'):
                self.db.users.find(sort = [('trips.count()', -1)], callback=self._people_entry)
        elif (type == 'latest'):
                self.db.users.find(sort = [('createdtime', -1)] , callback=self._people_entry)  
        elif (type == 'nearest'):
            if self.current_user:
                self.db.users.find({ 'current_position' : { '$near' : self.current_user['current_position']} } , callback=self._people_entry)  
            else:
                self.redirect('/login')
        
    def _people_entry(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        top_shares = self.syncdb.users.find().limit(10).sort("trip_count", pymongo.DESCENDING)
        self.render("travelers.html", users = response, top_shares = top_shares)

class UserHandler(BaseHandler):
    user = None
    
    @tornado.web.asynchronous
    def get(self, slug):
        
        self.user = self.syncdb.users.find_one({'slug':slug})
        if self.user:
            self.db.trips.find({'trip_id':{'$in':self.user['trips']}}, sort = [('published', -1)], callback=self._user_entry)
        else:
            self.redirect("exception.html")
                  
    def _user_entry(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        if self.current_user:
            
            check = True if self.user['slug'] == self.current_user['slug'] else False
        else:
            check = False
        self.render("userentry.html", check = check ,custom_user = self.user, trips = response)


class AddUserToTripHandler(BaseHandler):
    userid = None
    tripid = None
    group_id = None
    user = None
    @tornado.web.asynchronous
    def get(self, userid, tripid, group_id):
        self.userid = userid
        self.tripid = tripid
        self.group_id = group_id
        self.user = self.syncdb.users.find_one({'user_id':bson.ObjectId(userid)})
        self.db.trips.update({'trip_id':bson.ObjectId(tripid)},  {'$addToSet':{'members': self.user}, '$inc' : { 'member_count' : 1 }}, callback = self._add_user_to_trip)  
    
    def _add_user_to_trip(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        trip = self.syncdb.users.find_one({'trip_id':bson.ObjectId(self.tripid)})
        
        if self.user['slug'] not in trip['expense']:
                trip['expense'][self.user['slug']]=[]
                print '++++++++++++++++++++++++++++++++'
        self.syncdb.trips.save(trip)
        self.syncdb.users.update({'user_id':bson.ObjectId(self.userid)}, { '$addToSet':{'trips': bson.ObjectId(self.tripid)}})
        self.write('success')
    
    
    def post(self):
        userids = []
        self.userid = self.get_argument('user_id')
        userids.append(bson.ObjectId(self.userid))
        self.tripid = self.get_argument('trip_id')
        self.group_id = self.get_argument('group_id')
        if self.syncdb.trips.find({'trip_id':bson.ObjectId(self.tripid), 'groups.members.user_id':{'$in':userids}}).count()>0:
            self.write('existed')
            return
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(self.tripid)})
        user = self.syncdb.users.find_one({'user_id':bson.ObjectId(self.userid)})
        if user['slug'] not in trip['expense']:
                trip['expense'][user['slug']]=[{'date': '', 'amount': '', 'type': 'Select', 'description': ''}]
                
        if self.group_id =='new':
            group_template = trip['groups'][0].copy()
            group_template['group_id']=bson.ObjectId()
            group_template['members'] = []
            group_template['members'].append(user)            
            trip['groups'].append(group_template)
            user['group_id'] = group_template['group_id']
            
        #_user = self.syncdb.trips.find({'trip_id':bson.ObjectId(self.tripid), 'members.user_id': bson.ObjectId(self.userid)})
        else:
            
            for group in trip['groups']:
                if group['group_id'] == bson.ObjectId(self.group_id):
                    group['members'].append(user)
                    break
                    
            
        self.syncdb.trips.save(trip)
        self.syncdb.trips.update({'trip_id':bson.ObjectId(self.tripid)}, {'$inc' : { 'member_count' : 1 }}) 
        self.syncdb.users.update({'user_id':bson.ObjectId(self.userid)}, { '$addToSet':{'trips': bson.ObjectId(self.tripid)}})
        self.write(unicode(simplejson.dumps(user, cls=MongoEncoder.MongoEncoder.MongoEncoder)))
        
        
class RemoveUserFromTripHandler(BaseHandler):
    userid = None
    tripid = None
    def post(self):
        self.userid = self.get_argument('user_id')
        self.tripid = self.get_argument('trip_id')
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(self.tripid)})
        for group in trip['groups']:
            for i, member in enumerate(group['members']):
                if member['user_id'] == bson.ObjectId(self.userid):
                    del group['members'][i]
                    break
        self.syncdb.trips.save(trip)
        self.syncdb.trips.update({'trip_id':bson.ObjectId(self.tripid)}, {'$inc' : { 'member_count' : -1 }})  
        self.syncdb.users.update({'user_id':bson.ObjectId(self.userid)}, {'$pull':{'trips': bson.ObjectId(self.tripid)}})
        self.write('success')


class CheckUserinTripHandler(BaseHandler):
    def get(self, userid, tripid):  
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(tripid)})
        check = False
        for group in trip['groups']:
            for member in group['members']:
                if member['user_id'] == bson.ObjectId(userid):
                    check =True
        if check:
            self.write('existed')
        else:
            self.write('nonexisted')
    

class FollowUserHandler(BaseHandler):  
    def post(self, userid):
        if self.current_user:
            user = self.syncdb.users.find_one({'owner_id': bson.ObjectId(userid)})
            self.db.users.update({'owner_id':bson.ObjectId(self.current_user['user_id'])}, { '$addToSet':{'friends': user} }, callback = self._user_follow)     
        else:
            self.redirect("exception.html")
    
    def _user_follow(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        return "success"
        
class UnFollowUserHandler(BaseHandler):  
    def post(self, userid):
        if self.current_user:
            user = self.syncdb.users.find_one({'owner_id': bson.ObjectId(userid)})
            self.db.users.update({'owner_id':bson.ObjectId(self.current_user['user_id'])}, { '$pull':{'friends': user} }, callback = self._user_unfollow)     
        else:
            self.redirect("exception.html")
    
    def _user_unfollow(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        return "success"       

class ImportFriendHandler(BaseHandler):
    def post(self):
        type = self.get_argument('type')
        
        
class GetFriendHandler(BaseHandler):  
    def get(self):    
        
        user = self.syncdb.users.find_one({'user_id': {'$regex':bson.ObjectId(self.current_user['user_id'])}})
        if user:
            self.write(unicode(simplejson.dumps(user['friends'], cls=MongoEncoder.MongoEncoder.MongoEncoder)))

class GetTripMemberHandler(BaseHandler):
    def post(self):
        trip_id = self.get_argument("trip_id")
        users = self.trips.find_one({"trip_id":bson.ObjectId(trip_id)})['members']
        if users:
            self.write(unicode(simplejson.dumps(users, cls=MongoEncoder.MongoEncoder.MongoEncoder)))
        
class FriendRemoveHandler(BaseHandler):  
    @tornado.web.authenticated
    def post(self):
        user_id = self.get_argument('user_id')
        friend= self.syncdb.users.find_one({'user_id':bson.ObjectId(user_id)})
        _temp_friend = Users.Friend.FriendRequestHandler(friend)
        for item in self.current_user['friends']:
            if user_id == item['user_id']:
                self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'friends':_temp_friend.temp_friend}})
                _temp_friend = Users.Friend.FriendRequestHandler(self.current_user)   
                self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$pull':{'friends':_temp_friend.temp_friend}})
                   
            
class FriendRequestHandler(BaseHandler):  
    @tornado.web.authenticated
    def post(self):
        user_id = self.get_argument('user_id')
        _notification = Users.Notification.NotificationGenerator('friend_request', self.current_user['username'], self.current_user['slug'], self.current_user['picture'], datetime.datetime.utcnow(), self.current_user['user_id'])
        
        _temp_friend = Users.Friend.FriendRequestHandler(self.current_user)
        self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$addToSet':{'new_notifications':_notification.notification}})
        self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$addToSet':{'notifications':_notification.notification}})
        self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$addToSet':{'friends_request_receive':_temp_friend.temp_friend}})
        
        friend= self.syncdb.users.find_one({'user_id':bson.ObjectId(user_id)})
        _temp_friend = Users.Friend.FriendRequestHandler(friend)
        self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'friends_request_send':_temp_friend.temp_friend}})



class FriendConfirmHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        user_id = self.get_argument('user_id')
        type = self.get_argument('type')
        friend= self.syncdb.users.find_one({'user_id':bson.ObjectId(user_id)})
        if friend:
            _temp_friend = Users.Friend.FriendRequestHandler(friend)
            if type == 'accept':
                self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'friends':_temp_friend.temp_friend}})
                _temp_friend = Users.Friend.FriendRequestHandler(self.current_user)   
                self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$addToSet':{'friends':_temp_friend.temp_friend}})
                print('accept')
            elif type == 'decline':
                self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'friends_request_receive':_temp_friend.temp_friend}})
                _temp_friend = Users.Friend.FriendRequestHandler(self.current_user)   
                self.syncdb.users.update({'user_id':bson.ObjectId(user_id)}, {'$pull':{'friends_request_send':_temp_friend.temp_friend}})
                print('decline')
        else:
            print('error')


           
class UpdateUserProfileHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self): 
        
        if not self.current_user: return None
        user = self.syncdb.users.find_one({"user_id": bson.ObjectId(self.current_user['user_id'])})
        user['current_location'] = self.get_argument('current_location')
        user['bio'] = self.get_argument('description')
        user['email'] = self.get_argument('email')
        user_id = user['user_id']
        self.syncdb.users.save(user)
        
        if len(self.request.files)>0:
            file = self.request.files['picture'][0]
        #file = self.request.files.get('picture')[0]
            if not file: return None

            local_file_path = "/tmp/" +str(user_id) +str(file['filename'])
            output_file = open(local_file_path, 'w')
            output_file.write(file['body'])
        
            size = 50, 40

            im = Image.open(StringIO.StringIO(self.request.files.items()[0][1][0]['body']))
        
            im.thumbnail(size, Image.ANTIALIAS)
            im.save(local_file_path + ".thumbnail", "JPEG")
        
            s3_path = "/userpix_thumbs/"+str(user_id)+str(file['filename'])
        
            access_key = "AKIAJLDHNWC3WXD6PGVA"
            secret_key = "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"
            bucket = "tripshare"

            conn = S3Connection(access_key, secret_key)
            bucket = conn.get_bucket(bucket)
        
            k = Key(bucket)
            k.key = s3_path
            k.set_contents_from_filename(local_file_path, cb=percent_cb, num_cb=10)
            k.set_acl('public-read')
            output_file.close()
            self.syncdb.users.update({"user_id": bson.ObjectId(user_id)}, {"$set": { "picture": "http://tripshare.s3.amazonaws.com"+s3_path}}, upsert = False, safe=True)
        
        
        self.redirect('/settings')
        
         
     
     
class UserPictureHandler(BaseHandler):
    
    @tornado.web.authenticated
    @tornado.web.asynchronous 
    def post(self):
        user_id = self.get_secure_cookie("user")
        if not user_id: return None
        file = self.request.files['picture'][0]
        #file = self.request.files.get('picture')[0]
        if not file: return None

        local_file_path = "/tmp/" +str(user_id) +str(file['filename'])
        
        #print('file:++++++++++++++++='+local_file_path)
        output_file = open(local_file_path, 'w')
        output_file.write(file['body'])
        
        size = 50, 40
        
        
        #im = Image.open(str(file['filename']))
        im = Image.open(StringIO.StringIO(self.request.files.items()[0][1][0]['body']))
        
        im.thumbnail(size, Image.ANTIALIAS)
        im.save(local_file_path + ".thumbnail", "JPEG")
        
        s3_path = "/userpix_thumbs/"+str(user_id)+str(file['filename'])
        
        access_key = "AKIAJLDHNWC3WXD6PGVA"
        secret_key = "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"
        bucket = "tripshare"

        conn = S3Connection(access_key, secret_key)
        bucket = conn.get_bucket(bucket)
        
        k = Key(bucket)
        k.key = s3_path
        k.set_contents_from_filename(local_file_path, cb=percent_cb, num_cb=10)
        k.set_acl('public-read')
       
        
        #os.remove(local_file_path + ".thumbnail")
        self.syncdb.users.update({"user_id": bson.ObjectId(user_id)}, {"$set": { "picture": "http://tripshare.s3.amazonaws.com"+s3_path}}, upsert = False, safe=True)
        #print (str(result))
        
        self.redirect('/')
    
class UserSettingHandler(BaseHandler):
    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        _formData = simplejson.loads(self.get_argument('data'))

class UserEntryModule(tornado.web.UIModule):
    def render(self):
        return self.render_string("Module/userentry.html")
    
class UserSettingModule(tornado.web.UIModule):
    def render(self):
        return self.render_string("Module/usersetting.html")
        