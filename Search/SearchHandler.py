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
        users = self.syncdb.users.find({'lc_username': {'$regex':'^'+_name}}).limit(5)
        trips = self.syncdb.trips.find({'lc_tripname': {'$regex':'^'+_name}}).limit(5)
        guides = self.syncdb.guides.find({'lc_guidename': {'$regex':'^'+_name}}).limit(5)
        sites = self.syncdb.sites.find({'lc_sitename': {'$regex':'^'+_name}}).limit(5)
        
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
        else:
            self.write('not found');


class SearchUserHandler(BaseHandler):  
    def get(self, name):   
        
        _name = name.upper()
        users = self.syncdb.users.find({'lc_username': {'$regex':'^'+_name}})
        if users.count() >= 1 :
            self.write(self.render_string("Module/searchpeopleresult.html", searchuserresults = users)) 
        else:
            self.write(self.render_string("Module/searchpeopleresult.html", searchuserresults = None)) 

class RealTimeSearchUserHandler(BaseHandler):  
    def get(self, name): 
        #objects = []
        _name = name.upper()  
        users = self.syncdb.users.find({'lc_username': {'$regex':'^'+_name}})
        if users.count() >0 :
            #objects.append(users)
            self.write(unicode(simplejson.dumps(users, cls=MongoEncoder.MongoEncoder.MongoEncoder)))
            
        else:
            self.write('not found');      
            
class SearchFriendHandler(BaseHandler):
    def get(self, name):   
        _name = name.upper()
        users = self.syncdb.users.find({'lc_username': {'$regex':'^'+_name}})
        if users.count() >= 1 :
            self.write(self.render_string("Module/searchfriendresult.html", searchuserresults = users)) 
        else:
            self.write(self.render_string("Module/searchpeopleresult.html", searchuserresults = None)) 