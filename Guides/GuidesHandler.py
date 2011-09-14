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
        self.render("editguide.html", guide=guide)
        

class CreateGuidesHandler(BaseHandler):
    
    @tornado.web.authenticated
    def post(self):
        title = self.get_argument('title')
        #print("len:++++++++++++++"+len(destinations))
        destinations = self.get_arguments('destinations')
        description = ''
        #for idx, dest in enumerate(destinations):
        #    if(dest!=""):
        
        slug = unicodedata.normalize("NFKD", unicode(title)).encode("ascii", "ignore")      
        slug = re.sub(r"[^\w]+", " ", slug)
        slug = "-".join(slug.lower().strip().split())
        if not slug: slug = "guide"
        while True:
                #e = self.db.get("SELECT * FROM trips WHERE slug = %s", slug)
            e = self.syncdb.guides.find_one({'slug':slug})
            if not e: break
            slug += "-2"
        
                                
        self.syncdb.guides.save({ 'guide_id':bson.ObjectId(), 'slug': slug,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'description': str(description), 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(), 'random' : random.random()})
        self.syncdb.guides.ensure_index('guide_id',  unique = True)
        self.redirect("/guides/" + str(slug))
        #self.render("Guides/guides.html", )
