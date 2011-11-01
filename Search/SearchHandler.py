'''
Created on Nov 1, 2011

@author: jason
'''
import MongoEncoder.MongoEncoder
from Map.BrowseTripHandler import BaseHandler


class RealTimeSearchAllHandler(BaseHandler):  
    def get(self, name): 
        _name = name.upper()
        objects = []
        users = self.syncdb.users.find({'lc_username': {'$regex':'^'+_name}})
        trips = self.syncdb.trips.find({'lc_tripname': {'$regex':'^'+_name}})
        guides = self.syncdb.guides.find({'lc_guidename': {'$regex':'^'+_name}})
        sites = self.syncdb.sites.find({'lc_sitename': {'$regex':'^'+_name}})
        
        objects.append(users)
        objects.append(trips)
        objects.append(guides)
        objects.append(sites)
        if objects.count() >0 :
            
            self.write(unicode(simplejson.dumps(objects, cls=MongoEncoder.MongoEncoder.MongoEncoder)))
            #self.write(users[0]);
        else:
            self.write('not found');
        