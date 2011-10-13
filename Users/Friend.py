'''
Created on May 12, 2011

@author: jason
'''
import tornado.web


class FriendEntryModule(tornado.web.UIModule):
    def render(self, user, trips):
        return self.render_string("Module/friendentry.html", user = user, trips = trips)
    
class FriendRequestHandler():
    def __init__(self, user):
        self.temp_friend = {}
        self.temp_friend['user_id'] = user['user_id']
        self.temp_friend['slug'] = user['slug']
        self.temp_friend['picture'] = user['picture']