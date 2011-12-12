'''
Created on Aug 31, 2011

@author: Jason Huang
'''
import bson
import random
import datetime
import string
import simplejson
import pymongo
import re
import unicodedata
import tornado.web
from Map.BrowseTripHandler import BaseHandler
from Utility.DateProcessor import FromStringtoDate



class BrowseGuidesHandler(BaseHandler):
    def get(self):
        if self.current_user:  
            guides = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['save_guide'] }}).limit(10).sort('title')
        else:
            guides = None    
        self.render("Guides/guides.html", guides=guides)

class EntryGuidesHandler(BaseHandler):
    def get(self, slug):
        guide = self.syncdb.guides.find_one({"slug":slug})
        
        if not guide: raise tornado.web.HTTPError(404)
        self.render("editguide.html", guide=guide)
        
        
class CategoryGuidesHandler(BaseHandler):
    
    def post(self, section):
        count = self.get_argument('count')
        #print(count+'+++++++++++++')
        latest_guide_ids = None
        if section == "me":
            if self.current_user:  
                latest_guide_ids = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['save_guide'] }}).skip(int(count)).limit(10).sort('title')
            else:
                latest_guide_ids = self.syncdb.guides.find().limit(0)
        elif section == "national_park":
            latest_guide_ids = self.syncdb.guides.find({"type":'national_park'}).skip(int(count)).limit(10).sort('title')
        elif section == "city":
            latest_guide_ids = self.syncdb.guides.find({"type":'city'}).skip(int(count)).limit(10).sort('title')
        elif section == "world":
            latest_guide_ids = self.syncdb.guides.find({"type":'world'}).skip(int(count)).limit(10).sort('title')
        
        print(str(latest_guide_ids.count())+'+++++++++++++')
        if latest_guide_ids.count() >0:
                
                for latest_guide_id in latest_guide_ids:                        
                        self.write(self.render_string("Guides/guideentryinguides.html", guide = latest_guide_id) + "||||")
        else:
            self.write('<li><span>No guide for this category yet....</span></li>')
    
    def get(self, section):
        latest_guide_ids = None
        if section == "me":
            if self.current_user:               
                latest_guide_ids = self.syncdb.guides.find({"guide_id":  { "$in" : self.current_user['save_guide'] }}).limit(10).sort('title')
            else:
                latest_guide_ids = self.syncdb.guides.find().limit(0)
        elif section == "national_park":
            latest_guide_ids = self.syncdb.guides.find({"type":'national_park'}).limit(10).sort('title')
        elif section == "city":
            latest_guide_ids = self.syncdb.guides.find({"type":'city'}).limit(10).sort('title')
        elif section == "world":
            latest_guide_ids = self.syncdb.guides.find({"type":'world'}).limit(10).sort('title')
            
        if latest_guide_ids.count() >0:
                
                for latest_guide_id in latest_guide_ids:                        
                        self.write(self.render_string("Guides/guideentryinguides.html", guide = latest_guide_id) + "||||")
        else:
            self.write('<li><span>No guide for this category yet....</span></li>')
        
class AddGuidesTagHandler(BaseHandler):
    @tornado.web.authenticated  
    def post(self):
        guide_id = self.get_argument('guide_id')
        tag = self.get_argument('tag')
        self.syncdb.guides.update({'guide_id': bson.ObjectId(guide_id)}, {'$addToSet':{'tags': tag}})
            
     
class SaveGuidesHandler(BaseHandler):  
    @tornado.web.authenticated  
    def post(self):
        id = self.get_argument('guide_id')
        check  = self.syncdb.users.find_one({'user_id': bson.ObjectId(self.current_user['user_id']), 'save_guide': bson.ObjectId(id)})
        if check == None:
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'save_guide': bson.ObjectId(id)}})
            self.write('This guide is in your pack now')
        else:
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'save_guide': bson.ObjectId(id)}})
            
class UpdateGuidesHandler(BaseHandler):
    @tornado.web.authenticated  
    def post(self):
        #content = simplejson.loads(self.get_argument('content'))
        geo = self.get_argument('geo')
        guide_id = self.get_argument('id')
        self.syncdb.guides.update({'guide_id':guide_id}, {'$set':{'geo':geo}})
        
     
class LikeGuidesHandler(BaseHandler):
    @tornado.web.authenticated  
    def post(self):
        id = self.get_argument('guide_id')
        check  = self.syncdb.users.find_one({'user_id': bson.ObjectId(self.current_user['user_id']), 'like_guide': bson.ObjectId(id)})
        
        if check == None:
            print('check')
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$addToSet':{'like_guide': bson.ObjectId(id)}})
            self.syncdb.guides.update({'guide_id': bson.ObjectId(id)}, {'$inc':{'rating': 1}, '$addToSet':{'user_like': bson.ObjectId(self.current_user['user_id'])}})
        else:
            print('uncheck')
            self.syncdb.users.update({'user_id': bson.ObjectId(self.current_user['user_id'])}, {'$pull':{'like_guide': bson.ObjectId(id)}})
            self.syncdb.guides.update({'guide_id': bson.ObjectId(id)}, {'$inc':{'rating': -1}, '$pull':{'user_like': bson.ObjectId(self.current_user['user_id'])}})


class DeleteGuidesHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        id = self.get_argument('id')
        
        self.syncdb.guides.remove({'guide_id':bson.ObjectId(id)})
        self.redirect('/guides')
        
class ExportGuidesHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        guide_id = self.get_argument('guide_id')
        trip_id = self.get_argument('trip_id')
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        if guide_id not in trip['imported_guides']:
            
            trip_dest_place = trip['dest_place']
            last_trip = trip_dest_place[len(trip_dest_place)-1]
            date = FromStringtoDate.ToDate(last_trip['date'])
            #date = last_trip['date']
            one_day = datetime.timedelta(days=1)
            guide = self.syncdb.guides.find_one({'guide_id':bson.ObjectId(guide_id)})
            dest_place = guide['dest_place']
            title = trip['title']+' to '+ guide['title']
            for dest in dest_place:
                next_day = date+one_day
                dest['date'] = next_day.isoformat()
                dest['type'] = 'car'
           
                self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)}, {'$addToSet':{'dest_place':dest}})
                self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)}, {'$addToSet':{'tags':dest['dest']}})
                self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)}, {'$addToSet':{'imported_guides':guide_id}})
            
                
            self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)}, {'$set':{'title':title}})  
            #self.syncdb.guides.remove({'guide_id':bson.ObjectId(id)})
            self.write(trip['slug'])
        else:
            print('check+++++++++++++==')
            self.write('This guide is already exported to this trip')

class GetGuidesForImportHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        trip_id = self.get_argument('trip_id')
        tags = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})['tags']
        guides= []
        # need improvement here!
        guides_all_match = self.syncdb.guides.find({'tags':{'$in':tags}}).limit(10)
        for guide in guides_all_match:
            guides.append(guide)
        if guides_all_match.count()<5:
            guides_part_match = self.syncdb.guides.find({}).limit(5)
            for guide in guides_part_match:
                guides.append(guide)
            
        if len(guides)>0:
            for guide in guides:                        
                    self.write(self.render_string("Guides/guideentry.html", guide = guide) + "||||")

class CreateGuidesHandler(BaseHandler):
    slug = None
    @tornado.web.authenticated
    def post(self):
        
        content = simplejson.loads(self.get_argument('data'))
        title = content['title']
        tag = content['tag']
        destinations = content['destinations']
        description = ''
       
        
        self.slug = unicodedata.normalize("NFKD", unicode(title)).encode("ascii", "ignore")      
        self.slug = re.sub(r"[^\w]+", " ", self.slug)
        self.slug = "-".join(self.slug.lower().strip().split())
        if not self.slug: self.slug = "guide"
        while True:
               
            e = self.syncdb.guides.find_one({'slug':self.slug})
            if not e: break
            self.slug += "-2"
        
        self.syncdb.guides.ensure_index('guide_id',  unique = True)  
        guide_id = bson.ObjectId()                      
        #self.db.guides.save({ 'guide_id':bson.ObjectId(), 'slug': self.slug,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'title': title, 'description': str(description), 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(), 'random' : random.random()}, callback=self._create_guide)
        self.syncdb.guides.save({ 'guide_id':guide_id, 'rating':0, 'slug': self.slug,'owner_name': self.get_current_username(),'owner_id': self.current_user['user_id'], 'lc_guidename':title.upper(), 'title': title, 'description': str(description), 'type':'guide', 'search_type':'guide', 'dest_place':destinations, 'last_updated_by': self.current_user, 'published': datetime.datetime.utcnow(),'tags':[], 'user_like':[], 'random' : random.random()})
        
        for dest in destinations:
            if(dest!=""):
                self.syncdb.sites.save({'site_id':bson.ObjectId(), 'guide_id':guide_id, 'type':'', 'site_name':dest['dest'], 'location':[]})
            
        self.syncdb.guides.update({'guide_id':guide_id},{'$addToSet':{'tags': tag}})
        self.syncdb.guides.ensure_index('rating', pymongo.DESCENDING);
        self.syncdb.guides.ensure_index('guide_id', unique=True);
        self.redirect("/guide/" + str(self.slug))
       
    def _create_guide(self, response, error):
            if error:
                    raise tornado.web.HTTPError(500)
            
            self.syncdb.users.update({'user_id':bson.ObjectId(self.current_user['user_id'])}, { '$addToSet':{'guides': self.slug} })     
            print('redirect')
            self.redirect("/guide/" + str(self.slug))

class ImportGuideToTripHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        guide_id = self.get_argument('guide_id')
        group_id = self.get_argument('group_id')
        trip_id = self.get_argument('trip_id')
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        index = 0
        for i, group in enumerate(trip['groups']):
            if group['group_id'] == bson.ObjectId(group_id):
                index = i
                break
        
        
        
        if guide_id not in trip['groups'][index]['imported_guides']:
            guide = self.syncdb.guides.find_one({'guide_id':bson.ObjectId(guide_id)})
            last_trip = trip['groups'][index]['dest_place'][len(trip['groups'][index]['dest_place'])-1]
            date = FromStringtoDate.ToDate(last_trip['date'])
            one_day = datetime.timedelta(days=1)
            title = trip['title'] + ' to '+ guide['title']
            trip['title'] = title
            for dest in guide['dest_place']:
                _site = {}
                _site['notes'] = []
                next_day = date+one_day
                #_site['date']= dest['date'] = next_day.isoformat()
                dest['date'] = next_day.isoformat()
                _site['date'] = dest['date']
                _site['type'] = dest['type'] = 'car'
                _site['dest'] = dest['dest']
                site = self.syncdb.sites.find_one({'lc_username': {'$regex':'^'+ _site['dest'].upper()}})
                if site:
                    _site['description']= site['description']
                    _site['geo']= site['geo']
                else:
                    _site['description']= ''
                    _site['geo'] = ''
                trip['groups'][index]['dest_place'].append(_site)
                trip['groups'][index]['imported_guides'].append(guide_id)
                trip['tags'].append(dest['dest'])
                self.write(self.render_string("Sites/trip_site.html", site = _site)+ "||||")
            self.syncdb.trips.save(trip)
            #self.syncdb.trips.update({'trip_id':bson.ObjectId(trip_id)}, {'$set':{'title':title}})
            #self.syncdb.guides.remove({'guide_id':bson.ObjectId(id)})
          
        else:
            
            self.write('This guide is already imported')

class ImportGuidesHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        user_id = self.get_secure_cookie("user")
        if not user_id: return None
        if len(self.request.files)>0:
            
            file = self.request.files['guidefile'][0]
            if not file: return None
            local_file_path = "/tmp/" + user_id +str(file['filename'])
            output_file = open(local_file_path, 'w')
            output_file.write(file['body'])
            output_file.close()
            temp_file = open(local_file_path, 'r')
            file_list = temp_file.readlines()
            temp_file.close()
            
            guide_id = None

            for line in file_list:
                if line !='' and line !='\n':
                    print(line)
                    data = simplejson.loads(line)
                    if data['type'] == 'national_park' or data['type'] == 'city':
                        guide_id = bson.ObjectId()
                        guide = {'guide_id':guide_id, 'rating':0,'owner_name': self.get_current_username(),'owner_id': bson.ObjectId(self.current_user['user_id']), 'slug': data['parent_site_name'], 'lc_guidename':data['parent_site_name'].upper(), 'title': data['parent_site_name'], 'description': '', 'dest_place':[], 'last_updated_by': self.current_user['username'], 'published': datetime.datetime.utcnow(),'tags':[], 'user_like':[], 'search_type':'guide','type':data['type'], 'random' : random.random()}
                        self.syncdb.guides.save(guide, safe=True)
                    site_id = bson.ObjectId()
                    dest = {'dest':data['site_name'], 'type':'car','date':'', 'picture':'', 'description':''}
                    self.syncdb.guides.update({'guide_id':guide_id}, {'$addToSet':{'dest_place':dest}})
                    self.syncdb.guides.update({'guide_id':guide_id}, {'$addToSet':{'tags':data['site_name']}})
                    self.syncdb.sites.save({'site_id':site_id,'guide_id':guide_id,'type':data['type'], 'search_type':'site', 'lc_sitename':data['site_name'].upper(), 'site_name':data['site_name'], 'parent_site_name':data['parent_site_name'], 'location':data['location'], 'pictures':[], 'description':data['description']})       
             
        self.redirect('/guides')
          
            
        