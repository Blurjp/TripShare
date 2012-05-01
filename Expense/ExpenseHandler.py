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
from Auth.AuthHandler import ajax_login_authentication
from PaymentMethod.paypal.pay import Pay
from PaymentMethod.paypal.settings import *

class ExpenseRequestHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        content = simplejson.loads(self.get_argument('userexpense'))
        for userexpense in content['userexpense']:
            _notification = Users.Notification.ExpenseNotificationGenerator('expense_request', self.current_user['username'], self.current_user['slug'], self.current_user['picture'], datetime.datetime.utcnow(), self.current_user['user_id'], userexpense['expense'], userexpense['payment'])
            self.syncdb.users.update({'slug':userexpense['slug']}, {'$addToSet':{'new_notifications':_notification.notification}})
            self.syncdb.users.update({'slug':userexpense['slug']}, {'$addToSet':{'notifications':_notification.notification}})
            self.syncdb.users.update({'slug':userexpense['slug']}, {'$addToSet':{'expense_request_receive':userexpense}})
        self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'expense_request_send':content['userexpense']}})


class ExpenseSaveHandler(BaseHandler):
    @ajax_login_authentication
    def post(self):
        trip_id = self.get_argument("trip_id")
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        content = simplejson.loads(self.get_argument('data'))
        trip['expense'] = content
        self.syncdb.trips.save(trip)
        
class ExpenseCheckAccountHandler(BaseHandler):
    def get(self):
        user_id = self.current_user['user_id']   
        user = self.syncdb.users.find_one({'user_id':bson.ObjectId(user_id)})
        if 'payment_method' in user:
            self.write(user['payment_method'])
        else:
            self.write('none')
            
            
class ExpensePaymentAPIHandler(BaseHandler):
    def post(self):
        id = self.get_argument("id")
        method = self.get_argument("method")
        amount = float(self.get_argument("amount"))
        url = self.get_argument("url")
        notifications = self.syncdb.users.find_one({'user_id':self.current_user['user_id']})['notifications']
        for no in notifications:
            
            if no['id'] == bson.ObjectId(id):
                break
        user_id = no['user_id']
        user = self.syncdb.users.find_one({'user_id':bson.ObjectId(user_id)})
        receiver_account = 'cc_1333649259_per@hotmail.com'
        sender = 'yiyi_1333656770_per@hotmail.com'
        
        if 'payment_method' in user:
            
            #receiver_account = user['payment_method'][method]
            if method == 'paypal':
               pay = Pay(amount, sender, receiver_account, url, url,'',None,None,False)
               self.response = pay.makepayment()
               self.ProcessResponse()
            else:
                self.write('unknown payment method');
            
        else:
            self.write('payment information missing');
            
    def ProcessResponse(self):
        if "ack" in self.response["responseEnvelope"]:
            if self.response["responseEnvelope"]["ack"] in (PayPalConfig.ACK_SUCCESS, 
                                    PayPalConfig.ACK_SUCCESS_WITH_WARNING):
                if 'paymentExecStatus' in self.response:
            
                    if self.response['paymentExecStatus'] == PayPalConfig.PAYMENT_CREATED_SUCCESS:
                       self.write ('Payment has been created successfully')
                    elif self.response['paymentExecStatus'] == PayPalConfig.PAYMENT_COMPLETED_SUCCESS:
                       self.write ('Payment has been completed successfully')
                else:
                    self.write ('Payment failed')
            else:
                self.write ('Payment failed')
        else:
            self.write ('Payment failed')
    
            
        

class GetPaymentMethodHandler(BaseHandler):
    def post(self):
        id = self.get_argument("id")
        notifications = self.syncdb.users.find_one({'user_id':self.current_user['user_id']})['notifications']
        for no in notifications:
            
            if no['id'] == bson.ObjectId(id):
                print 'found'
                self.write(simplejson.dumps(no['payment_method']))
                return
        print 'not found'
        
        
class ExpenseProcessHandler(BaseHandler):
    @ajax_login_authentication
    def post(self):
        type = self.get_argument("type")
        
        if type=="decline":
            id = self.get_argument("id")
            
            user_id = self.current_user['user_id']
            user = self.syncdb.users.find_one({'user_id':bson.ObjectId(user_id)})
            
            for notification in user['notifications']:
                
                if notification['id'] == bson.ObjectId(id):
                    notification['result'] = "You declined the request."
                    print 'declined'
                    break
            self.syncdb.users.save(user)
        elif type=="pay":
            id = self.get_argument("id")
            user_id = self.get_argument("user_id")
            user = self.syncdb.users.find_one({'user_id':bson.ObjectId(user_id)})
            #notifications = user['notifications']
            for notification in user['notifications']:
                if notification['id'] == bson.ObjectId(id):
                    notification['result'] = "You paid the expense."
                    break
            self.syncdb.users.save(user)
    
class GetExpenseHandler(BaseHandler):
    @ajax_login_authentication
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
            
                
                