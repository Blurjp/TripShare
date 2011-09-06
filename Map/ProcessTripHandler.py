'''
Created on Oct 19, 2010

@author: Jason Huang
'''

import bson
import pymongo
import datetime
import tornado.web
from BrowseTripHandler import BaseHandler


  
class ShowTrips(BaseHandler):
        def get(self):
            
            zipcode = self.get_argument("zcnew")
            tripLocation = self.get_argument("tripLocation")
            tripScope = self.get_argument("tripScope")
        
            trips = self.db.query("SELECT * FROM trips where privacy = %s", str(2))
            greeting = "Welcome "+ str(self.get_current_username())
        
            user = self.db.get("SELECT * FROM users WHERE user_id = %s", self.current_user.id)
            self.render("TripSearch.html", trips=trips, greeting  = greeting, user = user, token = self.xsrf_token)    

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
            
            latest_trip_ids = self.syncdb.trips.find().limit(20).sort("published", pymongo.DESCENDING)
           
            if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        members = latest_trip_id['members']
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    print("true")
                                    break
                        latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id) + "||||"
                        #self.write(json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder, ensure_ascii=False, indent=0))
                        self.write(latest_trip_id['html'])
         
        def _on_new_trips(self, latest_trip_ids):
            if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        members = latest_trip_id['members']
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
            t = datetime.datetime.now()  
            latest_trip_ids = self.syncdb.trips.find({"end_date": {"$gt": t}}).sort("members", pymongo.DESCENDING).limit(20)
            if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        members = latest_trip_id['members']
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    print("true")
                                    break
                        latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id) + "||||"
                        #self.write(json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder, ensure_ascii=False, indent=0))
                        self.write(latest_trip_id['html'])
        
class ShowEndTrips(BaseHandler):
        
        def get(self):   
            t = datetime.datetime.now()
            latest_trip_ids = self.syncdb.trips.find({"end_date": {"$lt": t}}).sort("published", pymongo.DESCENDING).limit(20)
            if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        members = latest_trip_id['members']
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    print("true")
                                    break
                        latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id) + "||||"
                        #self.write(json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder, ensure_ascii=False, indent=0))
                        self.write(latest_trip_id['html'])