'''
Created on Nov 18, 2011

@author: jason
'''
import bson
import pymongo
import datetime
import tornado.web
from BrowseTripHandler import BaseHandler

class AddSiteInTrip(BaseHandler):
        def get(self): 
            _site = []
            content  = self.get_argument('content')
            
            site = self.syncdb.sites.find_one({'lc_username': {'$regex':'^'+content['site_name'].upper()}})
            if site:
                _site['description']= site['description']
                _site['geo']= site['geo']
            else:
                _site['description']= ''
                _site['geo'] = ''
            _site['date'] = content['date']
            _site['type'] = 'plane'
            _site['dest'] = content['site_name']
            
            trip_site = self.render_string("Sites/trip_site.html", site = _site)
                        #self.write(json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder, ensure_ascii=False, indent=0))
            self.write(trip_site)