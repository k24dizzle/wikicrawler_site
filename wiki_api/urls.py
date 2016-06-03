from django.conf.urls import url
from . import views
urlpatterns = [
    url(r'^get_ten', views.get_ten, name='get_ten'),
]
