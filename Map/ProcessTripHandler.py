'''
Created on Oct 19, 2010

@author: Jason Huang
'''

import bson
import pymongo
import datetime
import tornado.web
import simplejson
import MongoEncoder.MongoEncoder
from BrowseTripHandler import BaseHandler

            
class AddTripGroupHandler(BaseHandler):
        @tornado.web.authenticated
        def post(self): 
            trip_id = self.get_argument('trip_id')
            group_id = self.get_argument('group_id')
            user_id = self.get_argument('user_id')
            user = self.syncdb.find_one({'user_id':bson.ObjectId(user_id)})
            _groups = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})['groups']
            
            # add user to new group
            if group_id == '':
                group_id = bson.ObjectId()
                group_template = _groups[0]
                group_template['group_id']=bson.ObjectId(group_id)
                group_template['members'] = []
                group_template['members'].append(user)
                _groups.append(group_template)
                
            else:
                # add user to existed group
                for group in _groups:
                    if group['group_id'] == bson.ObjectId(group_id):
                        group['members'].append(user)
                    for user in group['members']:
                        if user['user_id'] == bson.ObjectId(user_id):
                            del user
                    
                        
            self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)},{'groups':_groups})

class GetTripGroupForMapHandler(BaseHandler):
    def get(self, group_id, trip_id):
        if group_id == 'default':
            group = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})['groups'][0]
        else:
            group = self.syncdb.trips.find_one({'groups.group_id':bson.ObjectId(group_id), 'trip_id':bson.ObjectId(trip_id)})
        self.write(unicode(simplejson.dumps(group, cls=MongoEncoder.MongoEncoder.MongoEncoder)))

class GetTripGroupForSiteHandler(BaseHandler):
    def get(self, group_id, trip_id):
        if group_id == 'default':
            group = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})['groups'][0]
            for site in group['dest_place']:
                        self.write(self.render_string("Sites/trip_site.html", site = site) + "||||")
        else:
            trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
            for _group in trip['groups']:
                if _group['group_id'] == bson.ObjectId(group_id):
                    for site in _group['dest_place']:
                        self.write(self.render_string("Sites/trip_site.html", site = site) + "||||")
                    break
                
class AddTripTagHandler(BaseHandler):  
    @tornado.web.authenticated  
    def post(self):
        trip_id = self.get_argument('trip_id')
        tag = self.get_argument('tag')
        self.syncdb.guides.update({'trip_id': bson.ObjectId(trip_id)}, {'$addToSet':{'tags': tag}})

class LikeTripHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self, id):
        check  = self.syncdb.users.find_one({'user_id': bson.ObjectId(self.current_user['user_id']), 'like_trip': bson.ObjectId(id)})
        
        if check == None:
            
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'like_trip': bson.ObjectId(id)}})
            self.syncdb.trips.update({'trip_id': bson.ObjectId(id)}, {'$inc':{'rating': 1}, '$addToSet':{'user_like': bson.ObjectId(self.current_user['user_id'])}})
        else:
            
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'like_trip': bson.ObjectId(id)}})
            self.syncdb.trips.update({'trip_id': bson.ObjectId(id)}, {'$inc':{'rating': -1}, '$pull':{'user_like': bson.ObjectId(self.current_user['user_id'])}})

  
class GetTrips(BaseHandler):
        def get(self): 
            members = []
            latest_trip_ids = self.syncdb.trips.find().limit(20).sort("published", pymongo.DESCENDING)
           
            if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        for _group in latest_trip_id['groups']:
                            for _member in _group['members']:
                                members.append(_member)
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    print("true")
                                    break
                        latest_trip_id['html'] = self.render_string("Module/tripinexportlist.html", trip = latest_trip_id) + "||||"
                        #self.write(json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder, ensure_ascii=False, indent=0))
                        self.write(latest_trip_id['html'])
                        
class SaveTrips(BaseHandler):
        slug = None
        
        @tornado.web.asynchronous
        @tornado.web.authenticated
        def post(self):   
            tripStart = self.get_argument("startPlace")
            tripDest = self.get_argument("endPlace")
            tripStartPosition = self.get_argument("startPosition")
            tripDestPosition = self.get_argument("endPosition")
            tripPath = self.get_argument("encodedPolyline")
            self.slug = self.get_argument("slug")
            #wayPoints = self.get_argument("wayPoints")
            #wayPoints = [1, 2, 3] 
            
            #===================================================================
            # if not wayPoints:
            #    self.db.trips.update({'slug':self.slug}, {'$set':{'start_place':tripStart, 'dest_place':tripDest, 'dest_place':tripDest, 'trip_path':tripPath}},  callback=self._save_callback)
            # else:
            #    self.db.trips.update({'slug':self.slug}, {'$set':{'start_place':tripStart, 'dest_place':tripDest, 'dest_place':tripDest, 'trip_path':tripPath}, '$pushAll':{'way_points': wayPoints} }, callback=self._save_callback)
            #===================================================================
            self.db.trips.update({'slug':self.slug}, {'$set':{'start_place':tripStart, 'dest_place':tripDest, 'start_place_position':tripStartPosition, 'dest_place_position':tripDestPosition,'trip_path':tripPath}},  callback=self._save_callback)
            
        def _save_callback(self, response, error):
            if error:
                    raise tornado.web.HTTPError(500)
            else: 
                    self.redirect("/trip/" + str(self.slug))
            #===================================================================
            # json = tornado.escape.json_decode(response.body)
            # self.write("Fetched %d entries from the FriendFeed API" %
            #       len(json['entries']))
            # self.finish()
            #===================================================================
            
class SubscribeTrip(BaseHandler):
        
        def get(self, trip_id):   
            if self.current_user:
                #trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id),  'members.user_id': bson.ObjectId(self.current_user['user_id']) } )
                if not self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id),  'members.user_id': bson.ObjectId(self.current_user['user_id']) } ):
                    self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)}, {'$addToSet':{'members':self.current_user} })
                    self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, { '$addToSet':{'trips':trip_id} })
                self.write("success"+trip_id)
            
            else:
                self.redirect("/login")               
            
class UnsubscribeTrip(BaseHandler):

        def get(self, trip_id): 
            if self.current_user:
                if self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id),  'members.user_id': bson.ObjectId(self.current_user['user_id']) } ):
                    self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)}, { '$pull':{'members': {'user_id': bson.ObjectId(self.current_user['user_id'])}}})
                    self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, { '$pop':{'trips':trip_id} })
                self.write("success"+trip_id)
            
            else:
                self.redirect("/login")


        
class ShowNewTrips(BaseHandler):
        def get(self): 
            members = []
            latest_trip_ids = self.syncdb.trips.find().limit(20).sort("published", pymongo.DESCENDING)
           
            if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        for _group in latest_trip_id['groups']:
                            for _member in _group['members']:
                                members.append(_member)
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    print("true")
                                    break
                        latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id) + "||||"
                        #self.write(json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder, ensure_ascii=False, indent=0))
                        self.write(latest_trip_id['html'])
         


class ShowHotTrips(BaseHandler):
        
        def get(self): 
            members = []
            t = datetime.datetime.now()  
            latest_trip_ids = self.syncdb.trips.find({"end_date": {"$gt": t}}).sort("members", pymongo.DESCENDING).limit(20)
            if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        for _group in latest_trip_id['groups']:
                            for _member in _group['members']:
                                members.append(_member)
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    #print("true")
                                    break
                        latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id) + "||||"
                        #self.write(json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder, ensure_ascii=False, indent=0))
                        self.write(latest_trip_id['html'])
        
class ShowEndTrips(BaseHandler):
        
        def get(self):   
            members = []
            t = datetime.datetime.now()
            latest_trip_ids = self.syncdb.trips.find({"end_date": {"$lt": t}}).sort("published", pymongo.DESCENDING).limit(20)
            if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        for _group in latest_trip_id['groups']:
                            for _member in _group['members']:
                                members.append(_member)
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    print("true")
                                    break
                        latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id) + "||||"
                        #self.write(json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder, ensure_ascii=False, indent=0))
                        self.write(latest_trip_id['html'])
                        
