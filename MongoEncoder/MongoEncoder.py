'''
Created on Apr 24, 2011

@author: jason
'''
import simplejson
import datetime
#from json import JSONEncoder
#import pymongo
from pymongo.objectid import ObjectId
from pymongo.cursor import Cursor

class MongoEncoder(simplejson.JSONEncoder):      
    def default(self, obj):
        # convert all iterables to lists
        if hasattr(obj, '__iter__'):
            return list(obj)
        # convert cursors to lists
        elif isinstance(obj, Cursor):
            return list(obj)
        # convert ObjectId to string
        elif isinstance(obj, ObjectId):
            return unicode(obj)
        # dereference DBRef
        
        # convert dates to strings
        elif isinstance(obj, datetime.datetime) or isinstance(obj, datetime.date) or isinstance(obj, datetime.time):
            return unicode(obj)
        return simplejson.JSONEncoder.default(self, obj)

