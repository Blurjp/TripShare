'''
Created on Nov 17, 2010

@author: Jason Huang
'''


import Marker
from datetime import datetime

class SaveMarker():
    @staticmethod
    def save(trip, type, description, latitude, longtidue): 
        tripMarker = Marker()
        tripMarker.type = type
        tripMarker.latitude = latitude
        tripMarker.longtidue = longtidue
        tripMarker.put()
        trip.markerGroup.append(tripMarker.key())
        trip.updateTime = datetime.now()
        trip.put()
   
        