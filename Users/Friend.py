'''
Created on May 12, 2011

@author: jason
'''
import tornado.web

class FriendEntryModule(tornado.web.UIModule):
    def render(self, user, trips):
        return self.render_string("Module/friendentry.html", user = user, trips = trips)