'''
Created on Oct 17, 2011

@author: jason
'''
from Map.BrowseTripHandler import BaseHandler
    
class SettingsHandler(BaseHandler):
    
    def get(self):
        
        self.render('setting.html', custom_user = self.current_user)
        