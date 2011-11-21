'''
Created on Nov 18, 2011

@author: jason
'''
import bson
from Map.BrowseTripHandler import BaseHandler

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