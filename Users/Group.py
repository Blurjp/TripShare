'''
Created on Oct 19, 2010

@author: Jason Huang
'''


from google.appengine.ext import db

class Group(db.Model):
        MapId = db.IntegerProperty(required=False)
        Title = db.StringProperty(required=True)
        Description = db.StringProperty(required=False)
        Owner = db.UserProperty(required=True)
        

class GroupMembership(db.Model):
        GroupId = db.IntegerProperty(required=True)
        UserId = db.IntegerProperty(required=True)
        MapId = db.IntegerProperty(required=True)