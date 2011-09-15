'''
Created on Aug 31, 2011

@author: Jason Huang
'''
import bson
import random
import datetime
import re
import unicodedata
import tornado.web
from Map.BrowseTripHandler import BaseHandler

class BrowseGuidesHandler(BaseHandler):
    def get(self):
        self.render("guides/guides.html")  

class EntryGuidesHandler(BaseHandler):
    def get(self, slug):
        guide = self.syncdb.guides.find_one({'slug': slug})
        if not guide: raise tornado.web.HTTPError(404)
        self.render("editguide.html", guide=guide)
        #self.render("terms.html")
        print('render')

class CreateGuidesHandler(BaseHandler):
    slug = None
    @tornado.web.authenticated
    def post(self):
        title = self.get_argument('title')
        #print("len:++++++++++++++"+len(destinations))
        destinations = self.get_arguments('destinations')
        description = ''
        #for idx, dest in enumerate(destinations):
        #    if(dest!=""):
        
        self.slug = unicodedata.normalize("NFKD", unicode(title)).encode("ascii", "ignore")      
        self.slug = re.sub(r"[^\w]+", " ", self.slug)
        self.slug = "-".join(self.slug.lower().strip().split())
        if not self.slug: self.slug = "guide"
        while True:
                #e = self.db.get("SELECT * FROM trips WHERE slug = %s", slug)
            e = self.syncdb.guides.find_one({'slug':self.slug})
            if not e: break
            self.slug += "-2"
        
        self.syncdb.guides.ensure_index('guide_id',  unique = True)                        
        #self.db.guides.save({ 'guide_id':bson.ObjectId(), 'slug': self.slug,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'description': str(description), 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(), 'random' : random.random()}, callback=self._create_guide)
        self.syncdb.guides.save({ 'guide_id':bson.ObjectId(), 'slug': self.slug,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'description': str(description), 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(), 'random' : random.random()})
        
        self.redirect("/guides/" + str(self.slug))
        #self.render("Guides/guides.html", )
    def _create_guide(self, response, error):
            if error:
                    raise tornado.web.HTTPError(500)
            
            self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, { '$addToSet':{'guides': self.slug} })     
            print('redirect')
            self.redirect("/guides/" + str(self.slug))
