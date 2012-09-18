'''
Created on Nov 19, 2010

@author: Jason Huang
'''
import simplejson
import bson
import datetime
import re
import pymongo
import random
import tornado.web
import unicodedata
from BrowseTripHandler import BaseHandler
from Utility.DateProcessor import FromStringtoDate
from Auth.AuthHandler import ajax_login_authentication

class ComposeHandler(BaseHandler):
    
    greeting = None
    singletrip = None
    trips = None
    slug = None
    trip_id = None
    
    
    #@tornado.web.asynchronous
    @ajax_login_authentication
    def get(self):
        
        id = self.get_argument("id", None)
        
        
        if id:
                self.greeting = "Welcome "+ self.get_current_username()
                #singletrip = self.db.get("SELECT * FROM trips WHERE trip_id = %s", int(id))
                #self.singletrip = self.db.trips.find_one({'trip_id':id})
                self.singletrip = self.syncdb.trips.find_one({'trip_id':id})
                #trips = self.db.query("SELECT * FROM trips where owner_id = %s ORDER BY published DESC LIMIT 10", self.current_user.user_id)
                #self.trips = self.db.trips.find({'owner_id':self.current_user.user_id}, limit = 10, callback=self._get_trips, sort = [('published', -1)])
                response = self.trips = self.syncdb.trips.find({'owner_id':self.current_user.user_id}).limit(10).sort('published', -1)
                self.render("Trips/edittrip.html", trips=response, singletrip=self.singletrip,  greeting= self.greeting)
        else:
                self.greeting = "Become a TripSharer!"
        
        #self.render("Trips/edittrip.html", singletrip=singletrip,  greeting= greeting, trips=trips)
        
    def _get_trips(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        self.render("Trips/edittrip.html", trips=response, singletrip=self.singletrip,  greeting= self.greeting)
        
    @tornado.web.asynchronous
    @ajax_login_authentication
    def post(self):
        
        tags = []
        members = []
        groups  = []
        group_id = bson.ObjectId()
        _formData = simplejson.loads(self.get_argument('data'))
        start = _formData['start']
        added_members = _formData['user_ids'].split('||')
                #added_members = dic["user_ids"].split('//') 
        for member_id in added_members:
                    #print(member_id+'------------------------------')
            if member_id != '' and member_id != None: 
                _member = self.syncdb.users.find_one({'user_id':bson.ObjectId(member_id)})
                
                members.append(_member)

        radio = _formData['privacy']

        if radio == 'private':
            privacy = 2 
        elif radio == 'public':
            privacy = 1
        else:
            privacy = 3
        
        dest_string = ""                
        destinations = _formData['destinations']
        
        for dest in destinations:
            if(dest!=""):
                tags.append(dest['dest'])
                if ',' in dest['dest']:  
                    dest_string += " to "+ dest['dest'][:(dest['dest'].find(','))]
                else:
                    dest_string += " to "+ dest['dest']
                geo = []
                geo1 = dest['loc'][dest['loc'].find('(')+1:dest['loc'].find(',')]
                geo2 = dest['loc'][dest['loc'].find(',')+1:dest['loc'].find(')')]
                geo.append(float(geo1))
                geo.append(float(geo2))
                dest['loc']= geo
                print (dest['loc'])
                dest['description'] = ''
                dest['notes'] = []
                dest['date'] = dest['date']
 
        title = "From "+start+dest_string
        tripStartPosition = ""
        start_date = destinations[0]['date']
        finish_date = _formData['finish-date']

        description = title
        self.slug = unicodedata.normalize("NFKD", unicode(title)).encode("ascii", "ignore")
        start_date_object = start_date
        #finish_date_object = FromStringtoDate.ToDate(finish_date)
        finish_date_object = finish_date
        trip_path = ""
        waypoints=[]
        members.append(self.current_user)
        expense = {}
        for member in members:
            expense[member['slug']] = [{'date': '', 'amount': '', 'type': 'Select', 'description': ''}]
        
        if _formData.has_key('id'):
            trip =  self.syncdb.trips.find_one({'trip_id':bson.ObjectId(_formData['id'])})
            if not trip: raise tornado.web.HTTPError(404)
            self.slug = trip.slug
        
            trip.title = title
            trip.start_place = start
            trip.start_date = start_date_object
            trip.finish_date = finish_date_object
            trip.dest_place = destinations
            trip.description = description
            trip.privacy = privacy
            trip.last_updated_by = self.current_user.username
            self.syncdb.trips.save(trip)
        else:
            self.slug = unicodedata.normalize("NFKD", unicode(title)).encode("ascii", "ignore")      
            self.slug = re.sub(r"[^\w]+", " ", self.slug)
            self.slug = "-".join(self.slug.lower().strip().split())
            if not self.slug: self.slug = "trip"
            while True:
                
                e = self.syncdb.trips.find_one({'slug':self.slug})
                if not e: break
                self.slug += "-2"

            self.trip_id = bson.ObjectId()
            _group = {'group_id': group_id,'members': members, 'start_place':start, 'dest_place':destinations, 'start_place_position':tripStartPosition, 'way_points':waypoints ,'trip_path':trip_path, 'start_date': start_date_object, 'finish_date': finish_date_object, 'imported_guides':[]}
            groups.append(_group)
            
            #self.db.trips.save({ 'trip_id':self.trip_id, 'groups':groups, 'rating':0,'user_like':[],'tags': tags,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'lc_tripname':title.upper(), 'title': title, 'slug':self.slug, 'search_type':'trip', 'type':'trip','member_count':len(members),'description': str(description), 'privacy': privacy, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(),'expense':expense,'random' : random.random()}, callback=self._create_trips)
            self.syncdb.trips.save({ 'trip_id':self.trip_id, 'groups':groups, 'rating':0,'user_like':[],'tags': tags,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'lc_tripname':title.upper(), 'title': title, 'slug':self.slug, 'search_type':'trip', 'type':'trip','member_count':len(members),'description': str(description), 'privacy': privacy, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(),'expense':expense,'random' : random.random()})
            for member in members:
                self.syncdb.users.update({'user_id':bson.ObjectId(member['user_id'])}, { '$addToSet':{'trips': self.trip_id}, '$inc':{'trip_count':1}})    
            self.syncdb.trips.ensure_index([('groups.dest_place.loc', pymongo.GEO2D), ('published',pymongo.DESCENDING)])
            self.syncdb.trips.ensure_index([('trip_id')], unique=True)
            self.syncdb.trips.ensure_index([('slug')], unique=True)
            self.redirect("/trip/" + str(self.slug))
            
    def _create_trips(self, response, error):
            if error:
                    raise tornado.web.HTTPError(500)
            self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, { '$addToSet':{'trips': self.trip_id}, '$inc':{'trip_count':1}})    
            
            self.syncdb.trips.ensure_index([('groups.dest_place.loc', pymongo.GEO2D), ('published',pymongo.DESCENDING)])
            self.syncdb.trips.ensure_index([('trip_id')], unique=True)
            self.syncdb.trips.ensure_index([('slug')], unique=True)
            print('redirect')
            self.redirect("/trip/" + str(self.slug))
            
class CreateTripModule(tornado.web.UIModule):
    def render(self):
        return self.render_string("Module/createtrip.html")
