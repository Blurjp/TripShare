'''
Created on Aug 4, 2010

@author: avepoint
'''

from google.appengine.ext import db
from google.appengine.api import users


class MTGCard(db.Model):
    name = db.StringProperty(required=True)
    edition = db.StringProperty()
    color = db.StringProperty()
    type = db.StringProperty()
    rarity = db.StringProperty()
    cost = db.StringProperty()
    pt = db.StringProperty()
    text = db.StringProperty()
    cmc = db.StringProperty()
    



        