'''
Created on Aug 31, 2011

@author: Jason Huang
'''
import bson
import random
import datetime
import simplejson
import pymongo
import re
import unicodedata
import tornado.web
from Map.BrowseTripHandler import BaseHandler

class BrowseGuidesHandler(BaseHandler):
    def get(self):
        # change the order to rate later
        guides = self.syncdb.guides.find().limit(10).sort("published", pymongo.DESCENDING)
        _guides = []
        for latest_guide_id in guides:
                latest_guide_id['html'] = self.render_string("Guides/guideentry.html", trip = latest_guide_id)
                _guides.append(latest_trip_id)
                        
        self.render("Guides/guides.html", guides=_guides)

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
        
        
        for ele in self.request.arguments:
            print(ele);
        content = simplejson.loads(self.get_argument('data'))
        title = content['title']
        print(title);
        destinations = content['destinations']
        
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
