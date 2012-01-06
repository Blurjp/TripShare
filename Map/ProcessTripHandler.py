'''
Created on Oct 19, 2010

@author: Jason Huang
'''

import bson
import pymongo
import re
import datetime
import tornado.web
import simplejson
import MongoEncoder.MongoEncoder
from BrowseTripHandler import BaseHandler

class MergeTripGroupHandler(BaseHandler):
        @tornado.web.authenticated
        def post(self):
            trip_id = self.get_argument('trip_id')
            #splitter = re.compile(r'test')
            group_ids = self.get_argument('group_ids')
            #main_group_id = self.get_argument('group_id')
            trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
            groups = trip['groups']
            main_group = groups[0]
            dates = []
            
            
            #for group in groups:
            #    if group['group_id'] == bson.ObjectId(main_group_id):
            #        main_group = group
            
            for dest_place in main_group['dest_place']:
                dates.append(dest_place['date'])
            
            for index, _group in enumerate(groups):
                if str(_group['group_id']) not in group_ids or index ==0:
                    continue;
                print _group['group_id']
                for member in _group['members']:
                    main_group['members'].append(member)
                for dest_place in _group['dest_place']:
                    if dest_place['date'] not in dates:
                        main_group['dest_place'].append(dest_place)
                del groups[index]
                
            self.syncdb.trips.save(trip)
            self.write('success')
                

class RemoveTripGroupHandler(BaseHandler):
        @tornado.web.authenticated
        def post(self): 
            trip_id = self.get_argument('trip_id')
            group_id = self.get_argument('group_id')
            if group_id == 'new':
                self.write('success')
                return
            groups = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})['groups']
            if self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id), 'groups.group_id':bson.ObjectId(group_id)}):
                len = 0
                for group in groups:
                    if group['group_id'] == bson.ObjectId(group_id):
                        len = 0 - group['members'].__len__()
                        
                print(str(group['members'].__len__()))
                self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)},{'$pull':{ 'groups': {'group_id':bson.ObjectId(group_id)}}})
                self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)},{'$inc':{'member_count': len}})
                self.write('success')
            
class AddTripGroupHandler(BaseHandler):
        
        @tornado.web.authenticated
        def post(self): 
            trip_id = self.get_argument('trip_id')
            group_id = self.get_argument('group_id')
            user_id = self.get_argument('user_id')
            trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
            _groups = trip['groups']
            _user = self.syncdb.users.find_one({'user_id':bson.ObjectId(user_id)})
            
            for group in _groups:
                    for index, user in enumerate(group['members']):
                        if user['user_id'] == bson.ObjectId(user_id):
                            del group['members'][index]
                            break
                            
            if group_id == 'new':
                
                group_id = bson.ObjectId()
                group_template = _groups[0].copy()
                group_template['group_id']=bson.ObjectId(group_id)
                group_template['members'] = []
                group_template['members'].append(_user)
                _groups.append(group_template)
                
                
            else:
                # add user to existed group   
                for index, group in enumerate(_groups):    
                    if group['group_id'] == bson.ObjectId(group_id):
                        _groups[index]['members'].append(_user)
                        
                        break
            
            self.syncdb.trips.save(trip)
            self.write('success')

class GetTripGroupForMergeHandler(BaseHandler):
    def post(self):
        trip_id = self.get_argument('trip_id')
        groups = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})['groups']
        self.write(unicode(simplejson.dumps(groups, cls=MongoEncoder.MongoEncoder.MongoEncoder)))                
          
class GetTripGroupForMapHandler(BaseHandler):
    def get(self, group_id, trip_id):
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        group = None
        if group_id == 'default' or group_id =='new':
            group = trip['groups'][0]
        else:
            for _group in trip['groups']:
                if _group['group_id'] == bson.ObjectId(group_id):
                    group = _group
                    break
        if group == None:
            return
        else:
            self.write(unicode(simplejson.dumps(group['dest_place'], cls=MongoEncoder.MongoEncoder.MongoEncoder)))

class GetTripGroupForSiteHandler(BaseHandler):
    def get(self, group_id, trip_id):
        if group_id == 'default' or group_id =='new':
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
        action = self.get_argument('action')
        if action == 'remove':
            self.syncdb.trips.update({'trip_id': bson.ObjectId(trip_id)}, {'$pull':{'tags': tag}})
        else:
            self.syncdb.trips.update({'trip_id': bson.ObjectId(trip_id)}, {'$addToSet':{'tags': tag}})

class LikeTripHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        id = self.get_argument('trip_id')
        check  = self.syncdb.users.find_one({'user_id': bson.ObjectId(self.current_user['user_id']), 'like_trip': bson.ObjectId(id)})
        if check == None:
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'like_trip': bson.ObjectId(id)}})
            self.syncdb.trips.update({'trip_id': bson.ObjectId(id)}, {'$inc':{'rating': 1}, '$addToSet':{'user_like': bson.ObjectId(self.current_user['user_id'])}})
        else:
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'like_trip': bson.ObjectId(id)}})
            self.syncdb.trips.update({'trip_id': bson.ObjectId(id)}, {'$inc':{'rating': -1}, '$pull':{'user_like': bson.ObjectId(self.current_user['user_id'])}})

class SaveTripHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        id = self.get_argument('trip_id')
        check  = self.syncdb.users.find_one({'user_id': bson.ObjectId(self.current_user['user_id']), 'save_trip': bson.ObjectId(id)})
        if check == None:
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'save_trip': bson.ObjectId(id)}})
        else:
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'save_trip': bson.ObjectId(id)}})

  
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
        @tornado.web.authenticated
        def get(self, trip_id):   
            check = False
            trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
            for group in trip['groups']:
                for member in group['members']:
                    if member['user_id'] == self.current_user['user_id']:
                        check = True
            if not check:
                trip['groups'][0]['members'].append(self.current_user)
            trip['member_count'] += 1
            self.syncdb.trips.save(trip)
            
class UnsubscribeTrip(BaseHandler):
        @tornado.web.authenticated
        def get(self, trip_id): 
            
            trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
            for index, group in enumerate(trip['groups']):
                for _index, member in enumerate(group['members']):
                    if member['user_id'] == self.current_user['user_id']:
                        del trip['groups'][index]['members'][_index]
            trip['member_count'] -= 1
            self.syncdb.trips.save(trip)
            
class ShowNewTrips(BaseHandler):
        def post(self):
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
            
            
        def get(self): 
            image_info=[]
            dest_places = []
            """ Get Latest trips to show in the map"""
            trips = self.syncdb.trips.find().limit(10).sort("published", pymongo.DESCENDING)
            if trips.count() > 0:
                for trip in trips:
                     trip_user = self.syncdb.users.find_one({'user_id': bson.ObjectId(trip['owner_id'])})
                     if (trip_user):
                         image_info.append(trip['title']+';'+trip_user['picture'] +';'+'/trip/'+trip['slug'])
                         dest_places.append(unicode(simplejson.dumps(trip['groups'][0]['dest_place'], cls=MongoEncoder.MongoEncoder.MongoEncoder)))
        
            """ Get latest trips to show in the list"""
        
            latest_trip_ids = trips
        
            top_shares = self.syncdb.users.find().sort("trip_count", pymongo.DESCENDING).limit(10)
            top_guides = self.syncdb.guides.find().sort("rating", pymongo.DESCENDING).limit(5)
        
            _trips = []
            if latest_trip_ids.count() > 0:
                    for latest_trip_id in latest_trip_ids:
                            latest_trip_id['check_join'] = False
                        
                            members = latest_trip_id['groups'][0]['members']
                            if self.current_user:
                                for member in members:
                                    if member['user_id'] == self.current_user['user_id']:
                                        latest_trip_id['check_join'] = True
                                        break
                                
                            #latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id)
                            _trips.append(latest_trip_id)
                        
        
            self.render("newbeforesignin.html", guides=top_guides, dest_places = dest_places, trips=trips, image_info=image_info, latest_trip_ids=_trips, top_shares = top_shares)
   
         


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
                        
