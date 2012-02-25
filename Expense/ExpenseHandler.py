'''
Created on Jan 21, 2012

@author: jason
'''
from Map.BrowseTripHandler import BaseHandler
import Users.Notification
import datetime
import tornado.web
import bson
import simplejson
from Utility.DateProcessor import GetMembers

class ExpenseRequestHandler(BaseHandler):

    @tornado.web.authenticated
    def post(self):
        content = simplejson.loads(self.get_argument('userexpense'))
        
         
        for userexpense in content['userexpense']:
            _notification = Users.Notification.ExpenseNotificationGenerator('expense_request', self.current_user['username'], self.current_user['slug'], self.current_user['picture'], datetime.datetime.utcnow(), self.current_user['user_id'], userexpense['expense'])
            self.syncdb.users.update({'slug':userexpense['slug']}, {'$addToSet':{'new_notifications':_notification.notification}})
            self.syncdb.users.update({'slug':userexpense['slug']}, {'$addToSet':{'notifications':_notification.notification}})
            self.syncdb.users.update({'slug':userexpense['slug']}, {'$addToSet':{'expense_request_receive':userexpense}})
        self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'expense_request_send':content['userexpense']}})


class ExpenseSaveHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        trip_id = self.get_argument("trip_id")
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        content = simplejson.loads(self.get_argument('data'))
        trip['expense'] = content
        self.syncdb.trips.save(trip)
        
class GetExpenseHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        trip_id = self.get_argument("trip_id")
        slug = self.get_argument("slug")
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        expenses = trip['expense']
        _index = 0
        members = GetMembers.GetTripMembers(self,trip_id)
        for index, member in enumerate(members):
            if member['slug'] == slug:
                _index = index
                break
        
        if trip:
            for index1, member in enumerate(members):
                    if index1==_index:
                        uitab = 'ui-tabs-panel ui-widget-content ui-corner-bottom'
                    else:
                        uitab = 'ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide'
                    print(index1)
                    self.write( self.render_string("Expense/ExpenseTable.html", uitab=uitab,index=index1, expenses = trip['expense'][member['slug']] ) + "||||")
            
                
                