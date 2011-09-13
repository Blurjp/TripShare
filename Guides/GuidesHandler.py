'''
Created on Aug 31, 2011

@author: Jason Huang
'''
import tornado.web
from Map.BrowseTripHandler import BaseHandler

class BrowseGuidesHandler(BaseHandler):
    def get(self):
        self.render("Guides/guides.html")  

class CreateGuidesHandler(BaseHandler):
    @tornado.web.asynchronous
    @tornado.web.authenticated
    def post(self):
        title = self.get_argument('title')
        #print("len:++++++++++++++"+len(destinations))
        destinations = self.get_argument('destinations')
        description = ''
        #for idx, dest in enumerate(destinations):
        #    if(dest!=""):
                                
        self.syncdb.guides.save({ 'guide_id':bson.ObjectId(), 'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'members': members,'description': str(description), 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(), 'random' : random.random()})
        
        self.render("Guides/guides.html")  
