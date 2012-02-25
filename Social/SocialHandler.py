import tornado.auth

        
        
class FaceBookPostHandler(tornado.web.RequestHandler, tornado.auth.FacebookMixin):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    def post(self):
        content = self.get_argument("invite_text")
        self.facebook_request(
            "/me/feed",
            post_args={"message": content},
            access_token=self.current_user["access_token"],
            callback=self.async_callback(self._on_post))

    def _on_post(self, new_entry):
        if not new_entry:
            # Call failed; perhaps missing permission?
            self.authorize_redirect()
            return
        self.finish("Posted a message!")
        

class TwitterPostHandler(tornado.web.RequestHandler,
                  tornado.auth.TwitterMixin):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    def post(self):
        content = self.get_argument("invite_text")
        self.twitter_request(
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