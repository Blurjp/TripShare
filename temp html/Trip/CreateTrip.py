'''
Created on Oct 27, 2010

@author: avepoint
'''
import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from Users.Greeting import Greeting


class CreateTrip(webapp.RequestHandler): 
    def post(self):
        # The GqlQuery interface prepares a query using a GQL query string.
        
        greeting = Greeting.GetGreeting()
        mapUrl = self.request.get('mapUrl')
        mapFeedUrl = self.request.get('mapFeedUrl')
       
#       Get google map information from the javascript result and show in the trip.html
       
#       # card_list = AddCard.add(current_user, demand_number, sell_number, cards_name_list)
#        card_list = []
##        
#        for card_name in cards_name_list:
#          _card = MTGCard.gql("where name = :1", card_name).fetch(1)
#          _user = UserProfile.gql("where card_user = :1", current_user).fetch(1)
##          if sell_number > 0 or demand_number > 0:
##                 _flag = True
#          if _card:
#            show_info = "card "+card_name+" found."
#            card_list.append(_card)
#            owner_set = OwnerTable.gql("where owner = :1 and card= :2", _user, _card).get()
#            if owner_set:
#             owner_set.sell = int(sell_number)
#             owner_set.demand = int(demand_number)
#             owner_set.flag = _flag
#             owner_set.put()
#              
#            else :
#             OwnerTable.card= _card.key()
#             OwnerTable(card = _card, owner=_user, demand=int(demand_number), sell=int(sell_number), flag = _flag).put()
#          else:
#              show_info = "card "+card_name+" not found."
#              break
          
             
#        show_info = "Your request has been submitted."
        template_values = {'mapUrl': mapUrl,
                           'mapFeedUrl': mapFeedUrl,
                           'greeting': greeting,
                           }
        path = os.path.join(os.path.split(os.path.dirname(__file__))[0], 'html/createdtrip.html')
        self.response.out.write(template.render(path, template_values)) 
        