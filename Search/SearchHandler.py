'''
Created on Nov 1, 2011

@author: jason
'''
import simplejson
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
        
        if users.count()>0:
            objects.append(users)
        if trips.count()>0:    
            objects.append(trips)
        if guides.count()>0:    
            objects.append(guides)
        if sites.count()>0:    
            objects.append(sites)
        if len(objects) >0 :
            
            self.write(unicode(simplejson.dumps(objects, cls=MongoEncoder.MongoEncoder.MongoEncoder)))
            #self.write(users[0]);
        else:
            self.write('not found');
        