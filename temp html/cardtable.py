import django_tables as tables 

class BookTable(tables.ModelTable):  
    id = tables.Column(sortable=False, visible=False)  
    book_name = tables.Column(name='title')  
    author = tables.Column(data='author__name')  

class Meta:  
        model = Book  

initial_queryset = Book.objects.all()  
books = BookTable(  
         initial_queryset,  
         order_by=request.GET.get('sort', 'title')) 

return render_to_response('cardtable.html', {'table': books})   