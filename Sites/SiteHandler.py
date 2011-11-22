'''
Created on Nov 18, 2011

@author: jason
'''
import bson
import datetime
import simplejson
import MongoEncoder.MongoEncoder
from Map.BrowseTripHandler import BaseHandler

class RemoveSiteFromTrip(BaseHandler):
        def post(self): 
            trip_id = self.get_argument('trip_id')
            site_name  = self.get_argument('site_name')
            self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)},{'$pull':{'site_name':site_name}})
            self.write('success')
            
            
class AddSiteToTrip(BaseHandler):
        def post(self): 
            _site = {}
            trip_id = self.get_argument('trip_id')
            site_name  = self.get_argument('site_name')
            date  = self.get_argument('date')
            ride = self.get_argument('site_ride')
            print(ride+'+++++++++++++++++++++==')
            site = self.syncdb.sites.find_one({'lc_username': {'$regex':'^'+site_name.upper()}})
            
            if site:
                _site['description']= site['description']
                _site['geo']= site['geo']
            else:
                _site['description']= ''
                _site['geo'] = ''
            _site['date'] = date
            _site['note'] = []
            _site['dest'] = site_name
            _site['type'] = ride
            trip_site = self.render_string("Sites/trip_site.html", site = _site)
            self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)},{'$addToSet':{'dest_place':_site}})
            self.write(trip_site)
            
class PostNoteToSite(BaseHandler):
        def post(self): 
            
            site_name = self.get_argument('site_name')
            trip_id = self.get_argument('trip_id')
            print(site_name)
            trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
            message = {"note": self.get_argument('note'), "date": datetime.datetime.utcnow(),'from': {'username': self.current_user['username'], 'user_id': self.current_user['user_id'], 'picture':self.current_user['picture']}}
            for place in trip['dest_place']:
                if place['dest'] == site_name:
                    place['note'].append(message)
                    break
            #response = {'comment_id': bson.ObjectId(),'body': content,'date': datetime.datetime.utcnow(),'from': {'username': self.current_user['username'], 'user_id': self.current_user['user_id'], 'picture':self.current_user['picture']}}
            #self.syncdb.trips.update({"trip_id":bson.ObjectId(trip_id),"dest_place.dest":site_name},  {'$push': {'dest_place.note':message}})
            self.syncdb.trips.save(trip)
            self.write(unicode(simplejson.dumps(message, cls=MongoEncoder.MongoEncoder.MongoEncoder)))
