'''
Created on Aug 31, 2011

@author: Jason Huang
'''
import bson
import random
import datetime
import string
import simplejson
import pymongo
import re
import unicodedata
import tornado.web
from Map.BrowseTripHandler import BaseHandler



class BrowseGuidesHandler(BaseHandler):
    def get(self):
        if self.current_user:  
            guides = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['save_guide'] }}).limit(5).sort("slug")    
        else:
            guides = None    
        self.render("Guides/guides.html", guides=guides)

class EntryGuidesHandler(BaseHandler):
    def get(self, slug):
        guide = self.syncdb.guides.find_one({"slug":slug})
        
        if not guide: raise tornado.web.HTTPError(404)
        #trips = []
        #if self.current_user:  
        #    for id in self.current_user['trips']:
        #        trips.append(self.syncdb.trips.find_one({'trip_id': bson.ObjectId(id)}))
        #self.render("editguide.html", guide=guide, trips = trips)
        self.render("editguide.html", guide=guide)
        
        
class CategoryGuidesHandler(BaseHandler):
    def get(self, section):
        latest_guide_ids = None
        if section == "me":
            latest_guide_ids = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['save_guide'] }}).limit(5).sort("slug")
        if section == "park":
            latest_guide_ids = self.syncdb.guides.find({"tag":'park'}).limit(5).sort("slug")
        elif section == "city":
            latest_guide_ids = self.syncdb.guides.find({"tag":'city'}).limit(5).sort("slug")
        elif section == "world":
            latest_guide_ids = self.syncdb.guides.find({"tag":'world'}).limit(5).sort("slug")
            
        if latest_guide_ids.count() >0:
                
                for latest_guide_id in latest_guide_ids:                        
                        self.write(self.render_string("Guides/guideentry.html", guide = latest_guide_id) + "||||")
        else:
            self.write('<li><span>No guide for this category yet....</span></li>')
        
class GuidePageHandler(BaseHandler):

    def get(self, _section, _index):
       
        section = _section
        index = string.atoi(_index)
        latest_guide_ids = None
        skip_number = index*3
        if section == "me":
            latest_guide_ids = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['save_guide'] }}).skip(skip_number).limit(5).sort("slug")
        if section == "park":
            latest_guide_ids = self.syncdb.guides.find({"tag":'park'}).skip(skip_number).limit(5).sort("slug")
        elif section == "city":
            latest_guide_ids = self.syncdb.guides.find({"tag":'city'}).skip(skip_number).limit(5).sort("slug")
        elif section == "world":
            latest_guide_ids = self.syncdb.guides.find({"tag":'world'}).skip(skip_number).limit(5).sort("slug")
            
        if latest_guide_ids!= None:
                for latest_guide_id in latest_guide_ids:                        
                        self.write(self.render_string("Guides/guideentry.html", guide = latest_guide_id) + "||||")
     
class SaveGuidesHandler(BaseHandler):  
    @tornado.web.authenticated  
    def post(self, id):
        check  = self.syncdb.users.find_one({'user_id': bson.ObjectId(self.current_user['user_id']), 'save_guide': bson.ObjectId(id)})
        if check == None:
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'save_guide': bson.ObjectId(id)}})
            self.write('This guide is in your pack now')
        else:
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'save_guide': bson.ObjectId(id)}})
            
class UpdateGuidesHandler(BaseHandler):
    @tornado.web.authenticated  
    def post(self):
        #content = simplejson.loads(self.get_argument('content'))
        geo = self.get_argument('geo')
        guide_id = self.get_argument('id')
        self.syncdb.guides.update({'guide_id':guide_id}, {'$set':{'geo':geo}})
        
     
class LikeGuidesHandler(BaseHandler):
    @tornado.web.authenticated  
    def post(self, id):
        check  = self.syncdb.users.find_one({'user_id': bson.ObjectId(self.current_user['user_id']), 'like_guide': bson.ObjectId(id)})
        print(check)
        if check == None:
            print('not check')
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'like_guide': bson.ObjectId(id)}})
            self.syncdb.guides.update({'guide_id': bson.ObjectId(id)}, {'$inc':{'rate': 1}})
        else:
            print('check')
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'like_guide': bson.ObjectId(id)}})
            self.syncdb.guides.update({'guide_id': bson.ObjectId(id)}, {'$inc':{'rate': -1}})


class DeleteGuidesHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        id = self.get_argument('id')
        
        self.syncdb.guides.remove({'guide_id':bson.ObjectId(id)})
        self.redirect('/guides')
        
class ExportGuidesHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        guide_id = self.get_argument('guide_id')
        trip_id = self.get_argument('trip_id')
        dest_place = self.syncdb.guides.find_one({'guide_id':bson.ObjectId(guide_id)})['dest_place']
        for dest in dest_place:
            self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)}, {'$addToSet':{'dest_place':dest}})
        #self.syncdb.guides.remove({'guide_id':bson.ObjectId(id)})
        self.write('Export successfully!')

class CreateGuidesHandler(BaseHandler):
    slug = None
    @tornado.web.authenticated
    def post(self):
        
        content = simplejson.loads(self.get_argument('data'))
        title = content['title']
        tag = content['tag']
        print(title);
        destinations = content['destinations']
        
        description = ''
       
        
        self.slug = unicodedata.normalize("NFKD", unicode(title)).encode("ascii", "ignore")      
        self.slug = re.sub(r"[^\w]+", " ", self.slug)
        self.slug = "-".join(self.slug.lower().strip().split())
        if not self.slug: self.slug = "guide"
        while True:
               
            e = self.syncdb.guides.find_one({'slug':self.slug})
            if not e: break
            self.slug += "-2"
        
        self.syncdb.guides.ensure_index('guide_id',  unique = True)  
        guide_id = bson.ObjectId()                      
        #self.db.guides.save({ 'guide_id':bson.ObjectId(), 'slug': self.slug,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'description': str(description), 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(), 'random' : random.random()}, callback=self._create_guide)
        self.syncdb.guides.save({ 'guide_id':guide_id, 'rating':'', 'slug': self.slug,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'description': str(description), 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(),'tag':[], 'random' : random.random()})
        self.syncdb.guides.update({'guide_id':guide_id},{'$addToSet':{'tag': tag}})
        self.syncdb.guides.ensure_index('rating', pymongo.DESCENDING);
        self.syncdb.guides.ensure_index('guide_id', unique=True);
        self.redirect("/guide/" + str(self.slug))
       
    def _create_guide(self, response, error):
            if error:
                    raise tornado.web.HTTPError(500)
            
            self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, { '$addToSet':{'guides': self.slug} })     
            print('redirect')
            self.redirect("/guide/" + str(self.slug))
