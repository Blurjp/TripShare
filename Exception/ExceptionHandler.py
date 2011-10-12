'''
Created on Oct 12, 2011

@author: jason
'''

import tornado.web
from Map.BrowseTripHandler import BaseHandler

class ExceptionPage(BaseHandler):
    def get(self):
        self.render('Exception.html')