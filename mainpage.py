'''
Created on July 19, 2010

@author: Jason Huang
'''
#!/usr/bin/env python

import pymongo
import asyncmongo
import os
import simplejson
import MongoEncoder.MongoEncoder
from Map.ProcessTripHandler import GetTrips
from Map.ProcessTripHandler import ShowNewTrips
from Map.ProcessTripHandler import ShowHotTrips
from Map.ProcessTripHandler import ShowEndTrips
from Map.ProcessTripHandler import SaveTrips
from Map.ProcessTripHandler import SubscribeTrip
from Map.ProcessTripHandler import UnsubscribeTrip
from Map.ProcessTripHandler import LikeTripHandler
from Map.ProcessTripHandler import SaveTripHandler
from Map.ProcessTripHandler import AddTripTagHandler
from Map.ProcessTripHandler import AddTripGroupHandler
from Map.ProcessTripHandler import RemoveTripGroupHandler
from Map.ProcessTripHandler import MergeTripGroupHandler
from Map.ProcessTripHandler import GetTripGroupForMergeHandler
from Map.ProcessTripHandler import GetTripGroupForMapHandler
from Map.ProcessTripHandler import GetTripGroupForSiteHandler
from Map.ProcessTripHandler import MyTripsHandler
from Users.UserInfo import UpdateUserProfileHandler

from Calendar.CalendarHandler import ExportCalendarHandler

from Expense.ExpenseHandler import ExpenseSaveHandler
from Expense.ExpenseHandler import ExpenseRequestHandler
from Expense.ExpenseHandler import GetExpenseHandler

from Map.BrowseTripHandler import BaseHandler
from Map.BrowseTripHandler import BrowseHandler
from Map.BrowseTripHandler import EntryHandler
from Map.BrowseTripHandler import TripPageHandler
from Map.CreateTripHandler import ComposeHandler
from Map.CreateTripHandler import CreateTripModule
from Users.Message import MessageHandler
from Users.Notification import NotificationHandler
from Settings.Settings import SettingsHandler
from Users.Friend import FriendEntryModule
from Auth.AuthHandler import CreateAccountHandler
from Auth.AuthHandler import LoginHandler
from Auth.AuthHandler import AuthLogoutHandler
from Auth.AuthHandler import AuthLoginFBHandler
from Auth.AuthHandler import AuthLogoutFBHandler
from Users.UserInfo import UserHandler
from Users.UserInfo import FollowUserHandler
from Users.UserInfo import UserSettingHandler
from Users.UserInfo import FriendRequestHandler
from Users.UserInfo import FriendRemoveHandler
from Users.UserInfo import FriendConfirmHandler
from Users.UserInfo import GetFriendHandler
from Users.UserInfo import UnFollowUserHandler
from Users.UserInfo import TravelersHandler
from Users.UserInfo import AddUserToTripHandler
from Users.UserInfo import RemoveUserFromTripHandler
from Users.UserInfo import CheckUserinTripHandler
from Users.UserInfo import GetTripMemberHandler
from Guides.GuidesHandler import SaveGuidesHandler
from Guides.GuidesHandler import LikeGuidesHandler
from Guides.GuidesHandler import BrowseGuidesHandler
from Guides.GuidesHandler import CreateGuidesHandler
from Guides.GuidesHandler import ExportGuidesHandler
from Guides.GuidesHandler import GetGuidesForImportHandler
from Guides.GuidesHandler import DeleteGuidesHandler
from Guides.GuidesHandler import EntryGuidesHandler

from Guides.GuidesHandler import ImportGuidesHandler
from Guides.GuidesHandler import ImportGuideToTripHandler
from Guides.GuidesHandler import CategoryGuidesHandler
from Guides.GuidesHandler import AddGuidesTagHandler
from Comment.CommentHandler import PostCommentHandler
from Comment.CommentHandler import DeleteCommentHandler
from Comment.CommentHandler import PostFeedHandler
from Exception.ExceptionHandler import ExceptionPage
from Search.SearchHandler import RealTimeSearchAllHandler
from Search.SearchHandler import SearchFriendHandler
from Search.SearchHandler import SearchUserHandler
from Search.SearchHandler import RealTimeSearchUserHandler
from Sites.SiteHandler import AddSiteToTrip
from Sites.SiteHandler import PostNoteToSite
from Sites.SiteHandler import RemoveSiteFromTrip

from Social.SocialHandler import FaceBookPostHandler
from Social.SocialHandler import TwitterPostHandler
#import tornado.database
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import bson
from tornado.options import define, options

define("port", default=80, help="run on the given port", type=int)
define("mysql_host", default="127.0.0.1:3306", help="trip database host")
define("mysql_database", default="TripShare", help="trip database name")
define("mysql_user", default="jason", help="trip database user")
define("mysql_password", default="jason", help="trip database password")
define("facebook_api_key", help="your Facebook application API key", default="221334761224948")
define("facebook_secret", help="your Facebook application secret", default="b0e85f25c5bfddb7ebf40b7670cf5db3")

#from functools import wraps
#from tornado.web import HTTPError
#from tornado.websocket import WebSocketHandler


""" Renders the main template."""



class MainPage(BaseHandler):
    
    def get(self):
       
        image_info=[]
        dest_places = []
        """ Get RANDOM trips to show in the map"""
        trips = self.syncdb.trips.find().limit(10)
        if trips.count() > 0:
            for trip in trips:
                trip_user = self.syncdb.users.find_one({'user_id': bson.ObjectId(trip['owner_id'])})
                if (trip_user):
                    image_info.append(trip['title']+';'+trip_user['picture'] +';'+'/trip/'+trip['slug'])
                    dest_places.append(unicode(simplejson.dumps(trip['groups'][0]['dest_place'], cls=MongoEncoder.MongoEncoder.MongoEncoder)))
        
        """ Get latest trips to show in the list"""
        
        latest_trip_ids = self.syncdb.trips.find().sort("published", pymongo.DESCENDING).limit(10)
        
        top_shares = self.syncdb.users.find().sort("trip_count", pymongo.DESCENDING).limit(10)
        top_guides = self.syncdb.guides.find().sort("rating", pymongo.DESCENDING).limit(5)
        
        _trips = []
        if latest_trip_ids.count() > 0:
                for latest_trip_id in latest_trip_ids:
                        latest_trip_id['check_join'] = False
                        
                        members = latest_trip_id['groups'][0]['members']
                        if self.current_user:
                            for member in members:
                                if member['user_id'] == self.current_user['user_id']:
                                    latest_trip_id['check_join'] = True
                                    break
                                
                        #latest_trip_id['html'] = self.render_string("Module/trip.html", trip = latest_trip_id)
                        _trips.append(latest_trip_id)
                        
        
        self.render("newbeforesignin.html", guides=top_guides, dest_places = dest_places, trips=trips, image_info=image_info, latest_trip_ids=_trips, top_shares = top_shares)

class Terms(BaseHandler):
    def get(self):
        self.render("terms.html")  
        
class Blog(BaseHandler):
    def get(self):
        self.render("blog.html")   
                     
 
class AboutUs(BaseHandler):
    def get(self):
        if self.current_user:
            greeting = "Welcome " + str(self.get_current_username())
            #user = None
        else:
            greeting = "Welcome "
            # user = self.db.get("SELECT * FROM users WHERE user_id = %s", self.current_user.id)
        self.render("aboutus.html", greeting = greeting)  
        
class ResetPassword(BaseHandler):
    def get(self):
        if self.current_user:
            greeting = "Welcome " + str(self.get_current_username())
            #user = None
        else:
            greeting = "Welcome "
            #user = self.db.get("SELECT * FROM users WHERE user_id = %s", self.current_user.id)
        self.render("resetpassword.html", greeting = greeting)   
        
class Privacy(BaseHandler):
    def get(self):        
        self.render("privacy.html") 

class Application(tornado.web.Application):
    def __init__(self):   
                            handlers = [
                                      # main page  
                                      (r"/", MainPage),
                                      # signup, login and logout
                                      (r"/login", LoginHandler),
                                      (r"/account/login", LoginHandler),
                                      (r"/account/create", CreateAccountHandler),
                                     # (r"/auth/login", AuthLoginHandler),
                                      (r"/auth/logout", AuthLogoutHandler),
                                      (r"/auth/fblogin", AuthLoginFBHandler),
                                      (r"/auth/fblogout", AuthLogoutFBHandler),
                                      (r"/updateusersetting", UserSettingHandler),
                                      (r"/saveexpense", ExpenseSaveHandler),
                                      (r"/getexpense", GetExpenseHandler),
                                      (r"/trips", BrowseHandler),   # where you create and browse trips
                                      (r"/trip/([^/]+)", EntryHandler),
                                      (r"/trips/([^/]+)/([^/]+)", TripPageHandler),
                                      (r"/like_trip", LikeTripHandler),
                                      (r"/save_trip", SaveTripHandler), #save the trip to personal save
                                      (r"/gettrips", GetTrips),
                                      (r"/createtrip", ComposeHandler),
                                      (r"/savetrip", SaveTrips),   #save the trip when edit trip
                                      (r"/newtrips", ShowNewTrips),
                                      (r"/hottrips", ShowHotTrips),
                                      (r"/endtrips", ShowEndTrips),
                                      (r"/addgrouptotrip", AddTripGroupHandler),
                                      (r"/removegroupfromtrip", RemoveTripGroupHandler),
                                      (r"/mergetripgroups", MergeTripGroupHandler),
                                      (r"/mytrips", MyTripsHandler),
                                      (r"/exportcalendar", ExportCalendarHandler),
                                      
                                      (r"/addsitetotrip", AddSiteToTrip),
                                      (r"/removesitefromtrip", RemoveSiteFromTrip),
                                      (r"/postsitenote", PostNoteToSite),
                                      (r"/guides", BrowseGuidesHandler),
                                      (r"/gettripgroupformerge", GetTripGroupForMergeHandler),
                                      (r"/gettripgroupformap/([^/]+)/([^/]+)", GetTripGroupForMapHandler),
                                      (r"/gettripgroupforsite/([^/]+)/([^/]+)", GetTripGroupForSiteHandler),
                                      (r"/add_trip_tag", AddTripTagHandler),
                                      (r"/guides/([^/]+)", CategoryGuidesHandler),
                                      (r"/guide/([^/]+)", EntryGuidesHandler),
                                      (r"/add_guide_tag", AddGuidesTagHandler),
                                      (r"/saveguide", SaveGuidesHandler),
                                      (r"/likeguide", LikeGuidesHandler),
                                      (r"/createguide", CreateGuidesHandler),
                                      (r"/exportguide", ExportGuidesHandler),
                                      (r"/getguidesforimport", GetGuidesForImportHandler),
                                      (r"/deleteguide", DeleteGuidesHandler),
                                      (r"/importguidefile", ImportGuidesHandler),
                                      (r"/importguidetotrip", ImportGuideToTripHandler),
                                      #(r"/a/changepicture", UserPictureHandler),
                                      (r"/updateuserprofile", UpdateUserProfileHandler),
                                  
                                      (r"/settings", SettingsHandler),
                                      (r"/blog", Blog),
                                      (r"/postcomment", PostCommentHandler),
                                      (r"/deletecomment", DeleteCommentHandler),
                                      (r"/postfeed", PostFeedHandler),
                                      (r"/searchpeople/([^/]+)", SearchUserHandler),
                                      (r"/realtime_searchpeople/([^/]+)", RealTimeSearchUserHandler),
                                      (r"/realtime_searchall/([^/]+)", RealTimeSearchAllHandler),
                                      (r"/checkuserintrip/([^/]+)/([^/]+)", CheckUserinTripHandler),
                                      
                                      (r"/sendexpenserequest", ExpenseRequestHandler),
                                      (r"/confirmfriend", FriendConfirmHandler),
                                      (r"/requestfriend", FriendRequestHandler),
                                      (r"/removefriend", FriendRemoveHandler),
                                      (r"/searchfriend/([^/]+)", SearchFriendHandler),
                                      (r"/getfriends", GetFriendHandler),
                                      (r"/gettripmembers", GetTripMemberHandler),
                                    
                                    
                                      (r"/travelers/([^/]*)", TravelersHandler),
                                      (r"/people/([^/]+)", UserHandler),
                                      
                                      #(r"/addusertotrip/([^/]+)/([^/]+)", AddUserToTripHandler),
                                      (r"/addusertotrip", AddUserToTripHandler),
                                      (r"/removeuserfromtrip", RemoveUserFromTripHandler),
                                      (r"/followpeople/([^/]+)", FollowUserHandler),
                                      # (r"/managemember/([^/]+)"), ManageMemberHandler),
                                      
                                      (r"/unfollowpeople/([^/]+)", UnFollowUserHandler),
                                      (r"/about/terms", Terms),
                                      (r"/about_us", AboutUs),
                                      (r"/about/privacy", Privacy),
                                      (r"/resetpassword", ResetPassword),
                                      (r"/subscribe_trip/([^/]+)", SubscribeTrip),
                                      (r"/unsubscribe_trip/([^/]+)", UnsubscribeTrip),
                                      #(r"/messages", MessageHandler),
                                      (r"/messages", NotificationHandler),
                                      (r"/static/images/(.*)", tornado.web.StaticFileHandler, {"path": "/home/jason/workspace/TripShare/static/images"}),
                                      
                                      (r"/post_on_facebook", FaceBookPostHandler),
                                      (r"/post_on_twitter", TwitterPostHandler),
                                      #(r"/send_email_invite", EmailInviteHandler),
                                      
                                      (r"/exception", ExceptionPage),
                          ]
                            settings = dict(
                                      blog_title=u"Tornado Trip",
                                      template_path=os.path.join(os.path.dirname(__file__), "templates"),
                                      ui_modules={"FriendEntry": FriendEntryModule, "CreateTrip": CreateTripModule},
                                      static_path=os.path.join(os.path.dirname(__file__), "static"),
                                      stylesheets_path=os.path.join(os.path.dirname(__file__), "stylesheets"),
                                      xsrf_cookies=True,
                                      facebook_api_key=options.facebook_api_key,
                                      facebook_secret=options.facebook_secret,
                                      debug = True,
                                      cookie_secret="11oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
                                      login_url = "/login",
                          )
                            tornado.web.Application.__init__(self, handlers, **settings)

                            # Have one global connection to the blog DB across all handlers
                            #===================================================
                            # self.db = tornado.database.Connection(
                            #   host=options.mysql_host, database=options.mysql_database,
                            #   user=options.mysql_user, password=options.mysql_password)
                            #===================================================
                            self.db = asyncmongo.Client(pool_id='mytestdb', host='127.0.0.1', port=27017, maxcached=10, maxconnections=50, dbname='TripShare')
                            self.syncdb = pymongo.Connection("localhost", 27017).TripShare
                            
def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()