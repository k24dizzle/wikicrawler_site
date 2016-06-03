import json
from django.shortcuts import render
from django.http import HttpResponse
from .tools import get_ten_links

# Create your views here.
def get_ten(request):
    page = request.path.split('/')[-1]
    ten_links = get_ten_links(page)
    out = json.dumps(ten_links)
    return HttpResponse(out)
