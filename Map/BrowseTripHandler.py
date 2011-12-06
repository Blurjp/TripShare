'''
Created on Dec 24, 2010

@author: jason
'''
import string
import bson
import logging
import tornado.web
import datetime
import simplejson
import MongoEncoder.MongoEncoder
import pymongo

class BaseHandler(tornado.web.RequestHandler):
    @property
    def db(self):
        #=======================================================================
        # if not hasattr(self, '_db'):
        #    self._db = asyncmongo.Client(pool_id='mytestdb', host='127.0.0.1', port=27017, maxcached=10, maxconnections=50, dbname='TripShare')
        #=======================================================================
        #return self._db
        return self.application.db
    
    @property
    def syncdb(self):
        return self.application.syncdb

    
    def get_current_user(self):
        #self.clear_all_cookies()
        user_id = self.get_secure_cookie("user")
        if not user_id: return None
        
        #return tornado.escape.json_decode(user_id)
        return self.syncdb.users.find_one({'user_id': bson.ObjectId(str(user_id))})
    
    def get_current_user_friends(self):  
        user_id = self.get_secure_cookie("user")
        if not user_id: return None 
        return self.syncdb.users.find_one({'user_id': bson.ObjectId(str(user_id))})["friends"]
    
    def get_current_username(self):
        user_id = self.get_secure_cookie("user")
        if not user_id: return None 
        return self.syncdb.users.find_one({'user_id': bson.ObjectId(str(user_id))})["username"]
        
    def get_db_user_id(self):
        user_id = self.get_secure_cookie("user")
        return bson.ObjectId(str(user_id))
    
    def _on_response(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        #self.render('template', full_name=response['full_name'])
        logging.info('response: +++++++++++++++++++++++=' + str(response))
        
    
    def _on_action(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        #self.render('template', full_name=response['full_name'])
        logging.info('_on_action: +++++++++++++++++++++++=' + str(response))
        
    def _get_trips(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        friends = self.current_user['friends']
        self.render("browsetrip.html", trips=response, friends = friends)
    

     
class BrowseHandler(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        if not self.current_user:  
            #trips = self.db.query("SELECT trip_id, slug, title FROM trips ORDER BY published DESC LIMIT 10")
            #self.db.trips.find({}, limit = 10, sort = [('published', -1)], callback=self._get_trips)
            self.redirect('/login')
            
        else:  
            #trips = self.db.query("SELECT trip_id, slug, title FROM trips where owner_id = %s ORDER BY published DESC LIMIT 10", self.current_user.user_id)
            self.db.trips.find({'owner_id':self.get_db_user_id()}, limit = 10, sort = [('published', -1)], callback=self._get_trips)
            #self.db.trips.find({}, limit = 10, sort = [('published', -1)], callback=self._get_trips)
            
        #self.render("browsetrip.html", trips=trips, token = self.xsrf_token)
        
        
class EntryHandler(BaseHandler):
    singletrip = None
    trips = None
    @tornado.web.asynchronous
    def get(self, slug):
        if self.current_user:
                self.singletrip = self.syncdb.trips.find_one({'slug':slug})
                if not self.singletrip: raise tornado.web.HTTPError(404)
                self.db.trips.find({'owner_id':self.get_db_user_id()}, limit = 10, sort = [('published', -1)], callback=self._trip_entry)   
        else:
                self.redirect('/account/login')
        
    def _trip_entry(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        print('_________________________test')
        print(unicode(simplejson.dumps(self.singletrip['groups'][0]['dest_place'], cls=MongoEncoder.MongoEncoder.MongoEncoder)))
        self.render("Trips/edittrip.html", group_id=self.singletrip['groups'][0]['group_id'] , singletrip=self.singletrip, dest_place = unicode(simplejson.dumps(self.singletrip['groups'][0]['dest_place'], cls=MongoEncoder.MongoEncoder.MongoEncoder)),token = self.xsrf_token, trips=response)
        
class TripPageHandler(BaseHandler):

    def get(self, _section, _index):
       
        section = _section
        index = string.atoi(_index)

        skip_number = index*3
        if section == "newtrips":
            latest_trip_ids = self.syncdb.trips.find().skip(skip_number).limit(3).sort("published", pymongo.DESCENDING)
        elif section == "hottrips":
            
            t = datetime.datetime.now()  
            latest_trip_ids = self.syncdb.trips.find({"end_date": {"$gt": t}}).skip(skip_number).limit(3).sort("members_count", pymongo.DESCENDING)
        elif section == "endtrips":
            t = datetime.datetime.now()
            latest_trip_ids = self.syncdb.trips.find({"end_date": {"$lt": t}}).skip(skip_number).limit(3).sort("published", pymongo.DESCENDING)
            
        if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        members = latest_trip_id['groups'][0]['members']
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    # print("true")
                                    break
                        
                        #temp_dumps = json.dumps(latest_trip_id, cls=MongoEncoder.MongoEncoder)
                       
                        #_latest_trip_id = json.loads(temp_dumps)
                        #_latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id) + "||||"
                     
                        #self.write(_latest_trip_id['html'])
                        self.write(self.render_string("Module/trip.html", trip = latest_trip_id) + "||||")
     
    