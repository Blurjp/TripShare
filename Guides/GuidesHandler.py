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
        # set "my collection" as default; change the order to saved date later
        guides = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['guides'] }}).limit(5).sort("slug")
        
        self.render("Guides/guides.html", guides=guides)

class EntryGuidesHandler(BaseHandler):
    def get(self, slug):
        guide = self.syncdb.guides.find_one({"slug":slug})
        
        if not guide: raise tornado.web.HTTPError(404)
        self.render("editguide.html", guide=guide)
        #self.render("terms.html")
        print('render')
        
class CategoryGuidesHandler(BaseHandler):
    def get(self, section):
        latest_guide_ids = None
        if section == "me":
            latest_guide_ids = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['guides'] }}).limit(5).sort("slug")
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
            latest_guide_ids = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['guides'] }}).skip(skip_number).limit(5).sort("slug")
        if section == "park":
            latest_guide_ids = self.syncdb.guides.find({"tag":'park'}).skip(skip_number).limit(5).sort("slug")
        elif section == "city":
            latest_guide_ids = self.syncdb.guides.find({"tag":'city'}).skip(skip_number).limit(5).sort("slug")
        elif section == "world":
            latest_guide_ids = self.syncdb.guides.find({"tag":'world'}).skip(skip_number).limit(5).sort("slug")
            
        if latest_guide_ids!= None:
                for latest_guide_id in latest_guide_ids:                        
                        self.write(self.render_string("Guides/guideentry.html", guide = latest_guide_id) + "||||")
     
    

class CreateGuidesHandler(BaseHandler):
    slug = None
    @tornado.web.authenticated
    def post(self):
        
        
        for ele in self.request.arguments:
            print(ele);
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
        self.syncdb.guides.save({ 'guide_id':guide_id, 'slug': self.slug,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'description': str(description), 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(),'tag':[], 'random' : random.random()})
        self.syncdb.guides.update({'guide_id':guide_id},{'$addToSet':{'tag': tag}})
        self.redirect("/guide/" + str(self.slug))
       
    def _create_guide(self, response, error):
            if error:
                    raise tornado.web.HTTPError(500)
            
            self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, { '$addToSet':{'guides': self.slug} })     
            print('redirect')
            self.redirect("/guide/" + str(self.slug))
