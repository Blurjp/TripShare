'''
Created on Aug 31, 2011

@author: Jason Huang
'''
from Map.BrowseTripHandler import BaseHandler

class BrowseGuidesHandler(BaseHandler):
    def get(self):
        self.render("Guides/guides.html")  

class CreateGuidesHandler(BaseHandler):
    def post(self):
        self.render("Guides/guides.html")  
