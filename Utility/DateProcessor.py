'''
Created on May 1, 2011

@author: jason
'''
import bson
from datetime import datetime
from Map.BrowseTripHandler import BaseHandler

class FromStringtoDate:    
    @staticmethod  
    def ToDate(date_string):
        #print('date++++++++++'+date_string)
        if(len(str(date_string))==9):
            day = date_string[8:9]
        else:
            day = date_string[8:10]
        month = date_string[5:7]
        year = date_string[0:4]
        date = datetime.strptime(year+'-'+month+'-'+day, "%Y-%m-%d")
        #print("date++++++++++"+str(date))
        return date
    

class GetMembers(BaseHandler):
    @staticmethod   
    def GetTripMembers(self, trip_id):   
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        groups = trip['groups']
        members = []
        for group in groups:
            for member in group['members']:
                members.append(member)
        members.reverse()
        return members