import tornado.auth
from Map.BrowseTripHandler import BaseHandler
        
        
class FaceBookPostHandler(BaseHandler, tornado.auth.FacebookGraphMixin):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    def post(self):
        
        if "access_token" in self.current_user:
        #print self.current_user["access_token"]
            content = self.get_argument("invite_text")
            self.facebook_request(
                "/me/feed",
                post_args={"message": content},
                access_token=self.current_user["access_token"],
                callback=self.async_callback(self._on_post))
        else:
            self.redirect("/auth/fblogin")

    def _on_post(self, new_entry):
        if not new_entry:
            print "call failed"
            # Call failed; perhaps missing permission?
            self.authorize_redirect()
            return
        self.redirect(self.get_argument("next", "/"))
        

class TwitterPostHandler(BaseHandler,
                  tornado.auth.TwitterMixin):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    def post(self):
        if "tw_access_token" in self.current_user:
            content = self.get_argument("invite_text")
            #print self.current_user["access_token"]
            self.twitter_request(
                "/statuses/update",
                post_args={"status": content},
                access_token=self.current_user["tw_access_token"],
                callback=self.async_callback(self._on_post))
        else:
            
            self.authorize_redirect('/auth/twlogin')

    def _on_post(self, new_entry):
        if not new_entry:
            # Call failed; perhaps missing permission?
            self.authorize_redirect()
            return
        self.redirect(self.get_argument("next", "/"))
        
        
class GooglePostHandler(tornado.web.RequestHandler,
                  tornado.auth.TwitterMixin):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    def post(self):
        content = self.get_argument("invite_text")
        self.google_request(
            "/statuses/update",
            post_args={"status": content},
            access_token=self.current_user["access_token"],
            callback=self.async_callback(self._on_post))

    def _on_post(self, new_entry):
        if not new_entry:
            # Call failed; perhaps missing permission?
            self.authorize_redirect()
            return
        self.finish("Posted a message!")