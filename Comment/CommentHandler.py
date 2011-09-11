'''
Created on Sep 9, 2011

@author: jason
'''
from Map.BrowseTripHandler import BaseHandler
import bson
import tornado.web

class PostCommentHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self, content, trip_id):
        
       # 123userinfo = {'username': self.current_user.user_id, 'user_id': self.current_user.username}
        self.syncdb.trips.update({'trip_id':trip_id},  {'$push': {'comments':
        {'comment_id': bson.ObjectId(),'body': content,'date': datetime.datetime.utcnow(),'from': {'username': self.current_user.user_id, 'user_id': self.current_user.username}}}})
        self.syncdb.trips.ensureIndex([('comments.comment_id',1)],[('unique',1)],['comments.date'],-1 )
        
class DeleteCommentHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self, comment_id, trip_id):
        self.syncdb.trips.update({'trip_id':trip_id}, {'$pull': {'comments': {'comment_id':comment_id}}})

class EditCommentHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self, comment_id, content):
        self.syncdb.trips.update({'comments.comment_id':comment_id}, {'$set': {'body': content}})