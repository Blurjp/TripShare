'''
Created on Nov 19, 2010

@author: Jason Huang
'''

from google.appengine.ext import db

class Marker(db.Model):
    '''
    classdocs
    '''
    type = db.StringProperty( choices=('start', 'dest', 'waypoint', 'normal'),required=True)
    latitude = db.FloatProperty(required=True)
    longitude = db.FloatProperty(required=True)
    description = db.TextProperty()

