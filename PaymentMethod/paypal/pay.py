import tornado

from tornado.options import define, options
import json
import logging
import urllib
import urllib2
#import settings

class Pay( object ):
  def __init__( self, amount, sender, receiver, return_url, cancel_url, remote_address, secondary_receiver=None, ipn_url=None, shipping=False ):
    self.headers = {
      'X-PAYPAL-SECURITY-USERID': options.SANDBOX_API_USER_NAME,
      'X-PAYPAL-SECURITY-PASSWORD': options.SANDBOX_API_PASSWORD,
      'X-PAYPAL-SECURITY-SIGNATURE': options.SANDBOX_API_SIGNATURE,
      'X-PAYPAL-REQUEST-DATA-FORMAT': 'JSON',
      'X-PAYPAL-RESPONSE-DATA-FORMAT': 'JSON',
      'X-PAYPAL-APPLICATION-ID': options.SANDBOX_APPLICATION_ID,
      'X-PAYPAL-DEVICE-IPADDRESS': '127.0.0.1',
    }

    data = {
      'senderEmail': sender,
      'currencyCode': 'USD',
      'returnUrl': return_url,
      'cancelUrl': cancel_url,
      'requestEnvelope': { 'errorLanguage': 'en_US' },
    }

    if shipping:
      data['actionType'] = 'CREATE'
    else:
      data['actionType'] = 'PAY'

    if secondary_receiver == None: # simple payment
      data['receiverList'] = { 'receiver': [ { 'email': receiver, 'amount': '%f' % amount } ] }
    else: # chained
      commission = amount * options.PAYPAL_COMMISSION
      data['receiverList'] = { 'receiver': [
          { 'email': receiver, 'amount': '%0.2f' % amount, 'primary': 'true' },
          { 'email': secondary_receiver, 'amount': '%0.2f' % ( amount - commission ), 'primary': 'false' },
        ]
      }

    if ipn_url != None:
      data['ipnNotificationUrl'] = ipn_url

    self.raw_request = json.dumps(data)
    
    
    
    #request = urllib2.Request( "%s%s" % ( settings.PAYPAL_ENDPOINT, "Pay" ), data=self.raw_request, headers=headers )
    #self.raw_response = urllib2.urlopen( request ).read()
    #url_test = "%s%s" % ( options.SANDBOX_ENDPOINT, "Pay" )
    #print url_test
    

  def makepayment(self):
    self.raw_response = url_request( "%s%s" % ( options.SANDBOX_ENDPOINT, "Pay" ), data=self.raw_request, headers=self.headers ).content()
    logging.debug( "response was: %s" % self.raw_response )
    return json.loads( self.raw_response )
    
    
    
   
      
class url_request( object ): 
  '''wrapper for urlfetch'''
  response = None
  def __init__( self, url, data=None, headers={} ):
    # urlfetch - validated
    http_client = tornado.httpclient.HTTPClient()
    try:
            self.response = http_client.fetch(url, body=data, headers=headers, method="POST", validate_cert=True )
            print self.response.body
            #return self.response.body
    except tornado.httpclient.HTTPError, e:
            print "Error:", e
    #self.response = ss.fetch( url, payload=data, headers=headers, method=urlfetch.POST, validate_certificate=True )
    # urllib - not validated
    #request = urllib2.Request(url, data=data, headers=headers) 
    #self.response = urllib2.urlopen( https_request )

  def content( self ):
    return self.response.body

  def code( self ):
    return self.response.status_code

class requestbuilder(object):
    def __init__(self, data):
        self.body = ''
        for key in data:
            self.body += str(key)+'='+str(data[key])+'&'
        self.body = self.body.replace('','')[:-1]
        print self.body
        
    def content(self):
        return self.body