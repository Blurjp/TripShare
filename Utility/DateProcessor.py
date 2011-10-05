'''
Created on May 1, 2011

@author: jason
'''

from datetime import datetime


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
    

        