'''
Created on Nov 19, 2010

@author: Jason Huang
'''
import simplejson
import bson
import datetime
import re
import random
import tornado.web
import unicodedata
from BrowseTripHandler import BaseHandler
from Utility.DateProcessor import FromStringtoDate

class ComposeHandler(BaseHandler):
    
    greeting = None
    singletrip = None
    trips = None
    slug = None
    
    
    @tornado.web.asynchronous
    @tornado.web.authenticated
    def get(self):
        
        id = self.get_argument("id", None)
        
        
        if id:
                self.greeting = "Welcome "+ self.get_current_username()
                #singletrip = self.db.get("SELECT * FROM trips WHERE trip_id = %s", int(id))
                self.singletrip = self.db.trips.find_one({'trip_id':id})
                
                #trips = self.db.query("SELECT * FROM trips where owner_id = %s ORDER BY published DESC LIMIT 10", self.current_user.user_id)
                self.trips = self.db.trips.find({'owner_id':self.current_user.user_id}, limit = 10, callback=self._get_trips, sort = [('published', -1)])
                
        else:
                self.greeting = "Become a TripSharer!"
        
        #self.render("edittrip.html", singletrip=singletrip,  greeting= greeting, trips=trips)
        
    def _get_trips(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        self.render("edittrip.html", trips=response, singletrip=self.singletrip,  greeting= self.greeting)
        
    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self, formData):
        
        members = []
        _formData = simplejson.loads(formData)
        #id = self.get_argument("id", None)
        #start = self.get_argument("start")
       
        start = _formData['start']
        
        #print('------------------------------'+start)    
           
        added_members = _formData['user_ids'].split('||')
                #added_members = dic["user_ids"].split('//') 
        for member_id in added_members:
                    #print(member_id+'------------------------------')
           if member_id != '' and member_id != None: 
              _member = self.syncdb.users.find_one({'user_id':bson.ObjectId(member_id)})
              members.append(_member)
                        
                        
        #destinations = self.get_argument("destinations_for_trips").split('//')
        #for i in range(0,len(destinations)-1):
        #    arguments = self.get_argument('dest'+i).split('//')
        #    destinations[i].append[arguments[2]]
        radio = _formData['privacy']

        if radio == 'private':
            privacy = 1 
        elif radio == 'public':
            privacy = 2
        else:
            privacy = 3
        
        dest_string = ""                
        destinations = _formData['destinations']
        #print("len:++++++++++++++"+len(destinations))
        for dest in destinations:
            if(dest!=""):
                dest_string += " to "+ dest['text']
                #print("dest.text+++++++++++++++++++++++=: "+dest['text'])
            
        title = "From "+start+dest_string
        tripStartPosition = ""
        tripDestPosition = "" 
        start_date = destinations[0]['date']
        finish_date = _formData['finish-date']

        description = title
      

     
        self.slug = unicodedata.normalize("NFKD", unicode(title)).encode("ascii", "ignore")
        start_date_object = FromStringtoDate.ToDate(start_date)
        finish_date_object = FromStringtoDate.ToDate(finish_date)
        
        
        if _formData.has_key('id'):
            trip =  self.syncdb.trips.find_one({'trip_id':_formData['id']})
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
        else:
            self.slug = unicodedata.normalize("NFKD", unicode(title)).encode("ascii", "ignore")      
            self.slug = re.sub(r"[^\w]+", " ", self.slug)
            self.slug = "-".join(self.slug.lower().strip().split())
            if not self.slug: self.slug = "trip"
            while True:
                #e = self.db.get("SELECT * FROM trips WHERE slug = %s", slug)
                e = self.syncdb.trips.find_one({'slug':self.slug})
                if not e: break
                self.slug += "-2"
   

            trip_path = ""
            waypoints=[]
            members.append(self.current_user)
            self.syncdb.trips.ensure_index([('start_place_position', GEO2D), ('dest_place_position', GEO2D), ('published',DESCENDING)])
            #self.syncdb.trips.ensure_index([('dest_place_position', '2d')])
            self.syncdb.trips.ensure_index('trip_id', unique=True)
            self.syncdb.trips.ensure_index('slug', unique=True)
            
            
            self.db.trips.save({ 'trip_id':bson.ObjectId(), 'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'slug':self.slug, 'members': members,'description': str(description), 'start_place':start, 'dest_place':destinations, 'start_place_position':tripStartPosition, 'dest_place_position':tripDestPosition, 'way_points':waypoints ,'trip_path':trip_path, 'privacy': privacy, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(), 'start_date': start_date_object, 'finish_date': finish_date_object, 'random' : random.random()}, callback=self._create_trips)

        
    def _create_trips(self, response, error):
            if error:
                    raise tornado.web.HTTPError(500)
            
            self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, { '$addToSet':{'trips': self.slug} })     
            print('redirect')
            self.redirect("/trip/" + str(self.slug))
            
class CreateTripModule(tornado.web.UIModule):
    def render(self):
        return self.render_string("Module/createtrip.html")
