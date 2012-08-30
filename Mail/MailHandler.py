import tornado
import boto
from Map.BrowseTripHandler import BaseHandler
import simplejson as json

from tornado.options import define, options
from Auth.AuthHandler import ajax_login_authentication

class MailSnake(object):
    def __init__(self, extra_params = {}):
        """
            Cache API key and address.
        """
        #self.apikey = options.MAILCHIMP_API_KEY
        self.apikey = "adc8df36f4e452eb4b620779bb527069-us4"

        self.default_params = {'apikey':self.apikey}
        self.default_params.update(extra_params)

        dc = 'us1'
        if '-' in self.apikey:
            dc = self.apikey.split('-')[1]
        self.base_api_url = 'https://%s.sts.mailchimp.com/1.0/' % dc

    def call(self, method, params = {}):
        url = self.base_api_url + method
        all_params = self.default_params.copy()
        all_params.update(params)

        post_data = json.dumps(all_params)
        headers = {'Content-Type': 'application/json'}
        #request = urllib2.Request(url, post_data, headers)
        #response = urllib2.urlopen(request)

        #return json.loads(response.read())
    
        http_client = tornado.httpclient.HTTPClient()
        try:
            self.response = http_client.fetch(url, body=post_data, headers=headers, method="POST")
            print self.response.body
            return json.loads(self.response.body)
            #return self.response.body
        except tornado.httpclient.HTTPError, e:
            print "Error:", e

    def __getattr__(self, method_name):

        def get(self, *args, **kwargs):
            params = dict((i,j) for (i,j) in enumerate(args))
            params.update(kwargs)
            return self.call(method_name, params)

        return get.__get__(self)
    
class EmailInviteHandler(BaseHandler):
    @ajax_login_authentication
    def post(self):
        
        addresses = self.get_argument('mail').split(';')
        text = self.get_argument('text')
        html_body = text
        conn = boto.connect_ses(aws_access_key_id=self.settings["amazon_access_key"], aws_secret_access_key=self.settings["amazon_secret_key"])
        #mail.SendEmail(string apikey, array message, bool track_opens, bool track_clicks, array tags)
        for address in addresses:
            if address!='':
                conn.send_email('blurjp@gmail.com','Welcome to TripShare',html_body,[address])

        self.redirect('/settings')
        
        