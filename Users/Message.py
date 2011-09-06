'''
Created on Mar 30, 2011

@author: jason
'''

import tornado.web
from Map.BrowseTripHandler import BaseHandler

class MessageHandler(BaseHandler):
    @tornado.web.asynchronous
    def get(self):
        self.db.users.find({'user_id': self.current_user.user_id}, limit=1, callback=self._on_response)
        # or
        # conn = self.db.connection(collectionname="...", dbname="...")
        # conn.find(..., callback=self._on_response)

    def _on_response(self, response, error):
        if error:
            raise tornado.web.HTTPError(500)
        self.render('message.html', messages=response["messages"])
