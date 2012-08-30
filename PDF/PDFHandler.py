'''
Created on Sep 9, 2011

@author: jason
'''
from Map.BrowseTripHandler import BaseHandler
from pyfpdf import FPDF, HTMLMixin
import bson
import unicodedata

html = """
<H1 align="center">html2fpdf</H1>
<h2>Basic usage</h2>
<p>You can now easily print text while mixing different
styles : <B>bold</B>, <I>italic</I>, <U>underlined</U>, or
<B><I><U>all at once</U></I></B>!
 
<BR>You can also insert hyperlinks
like this <A HREF="http://www.mousevspython.com">www.mousevspython.comg</A>,
or include a hyperlink in an image. Just click on the one below.<br>

 
<h3>Sample List</h3>
<ul><li>option 1</li>
<ol><li>option 2</li></ol>
<li>option 3</li></ul>
 
<table border="0" align="center" width="50%">
<thead><tr><th width="30%">Header 1</th><th width="70%">header 2</th></tr></thead>
<tbody>
<tr><td>cell 1</td><td>cell 2</td></tr>
<tr><td>cell 2</td><td>cell 3</td></tr>
</tbody>
</table>
"""

class MyFPDF(FPDF, HTMLMixin):
      pass
  

       
class DownloadPDFHanlder(BaseHandler):
    html = ""
    def makeHTML(self, trip):
        groups = trip['groups']
        people = ''
        pictures = ''
        dest = ''
        for index, group in enumerate(groups):
            people +="""<B>Group"""+str(index+1)+":</B><br>"""
            dest +="""<B>Group"""+str(index+1)+":</B><br>"""
            for member in groups[index]['members']:
                
                pictures += """<img src="""+unicodedata.normalize('NFKD', member['picture']).encode('ascii','ignore')+""" width="150" height="150">""" 
                people += """<B>"""+member['username']+"""   </B>"""
            for dest_place in groups[index]['dest_place']:
                dest += """<B>Destination:  """+dest_place['dest']+"""       Date:"""+dest_place['date']+"""</B><br>""" 
            people += """<br>"""
            dest += """<br>"""
        self.html = """
<H1 align="center">Trip: """+str(trip['title'])+"""</H1>
<h2>Groups:</h2>
<p>"""+ str(people)+"""</p>
 <h2>Itinerary:</h2>
<p>"""+ str(dest)+"""</p>
"""
    
    def post(self):
        trip_id = self.get_argument('trip_id')
        trip = self.syncdb.trips.find_one({'trip_id':bson.ObjectId(trip_id)})
        title = trip['title']
        pdf=MyFPDF()
#First page
        self.makeHTML(trip)
        pdf.add_page()
        pdf.write_html(self.html)
        pdf.output(title+'.pdf','F')
        self.set_header ('Content-Type', 'application/pdf')
        self.set_header ('Content-Disposition', 'attachment; filename='+title+'.pdf')
        f = open(title+".pdf","r")
        #print (f.read())
        self.write(f.read())
        self.finish()