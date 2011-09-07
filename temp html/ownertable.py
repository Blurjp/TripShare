'''
Created on Aug 4, 2010

@author: avepoint
'''

from google.appengine.ext import db
from google.appengine.api import users

import card

class OwnerTable(db.Model):
    card = db.ReferenceProperty(card.MTGCard,
                                   required=True,
                                   collection_name='owners')
    owner = db.ReferenceProperty(user_profile.UserProfile,
                                   required=True,
                                   collection_name='cards')
    demand = db.IntegerProperty(required=True, default=0)
    sell = db.IntegerProperty(required=True, default=0)
    
    