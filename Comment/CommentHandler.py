'''
Created on Sep 9, 2011

@author: jason
'''
from Map.BrowseTripHandler import BaseHandler
import bson
import tornado.web
import datetime

class PostCommentHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        
        feed_id = self.get_argument('feed_id')
        content = self.get_argument('content')
        response = {'comment_id': bson.ObjectId(),'body': content,'date': datetime.datetime.utcnow(),'from': {'username': self.current_user['username'], 'user_id': self.current_user['user_id'], 'picture':self.current_user['picture']}}
        self.syncdb.trips.update({'feeds.feed_id':feed_id},  {'$push': {'feeds.comments':response}})
        self.syncdb.trips.ensure_index([('comments.comment_id',1),('unique',1),('comments.date',-1)])
        self.write(response)
        
class DeleteCommentHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        comment_id = self.get_argument('comment_id')
        feed_id = self.get_argument('feed_id')
        self.syncdb.trips.update({'feeds.feed_id':feed_id}, {'$pull': {'feeds.comments': {'comment_id':comment_id}}})

class EditCommentHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        comment_id = self.get_argument('comment_id')
        content = self.get_argument('content')
        self.syncdb.trips.update({'feeds.comments.comment_id':comment_id}, {'$set': {'body': content}})
        
class PostFeedHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        trip_id = self.get_argument('trip_id')
        content = self.get_argument('content')
        self.syncdb.trips.update({'trip_id':trip_id},  {'$push': {'feeds':
        {'feed_id': bson.ObjectId(),'body': content,'date': datetime.datetime.utcnow(),'from': {'username': self.current_user['username'], 'user_id': self.current_user['user_id'], 'picture':self.current_user['picture']}}}})
        self.syncdb.trips.ensure_index([('feeds.feed_id',1),('unique',1),('feeds.date',-1)])
        
class DeleteFeedHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self, feed_id, trip_id):
        self.syncdb.trips.update({'trip_id':trip_id}, {'$pull': {'feeds': {'feed_id':feed_id}}})

class EditFeedHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self, feed_id, content):
        self.syncdb.trips.update({'feeds.feed_id':feed_id}, {'$set': {'body': content}})