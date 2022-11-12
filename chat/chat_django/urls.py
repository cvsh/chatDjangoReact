
from django.urls import path, include
#now import the views.py file into this code
from . import views
from rest_framework import routers
from django.views.generic.base import RedirectView
from rest_framework_jwt.views import obtain_jwt_token

router = routers.DefaultRouter()
router.register(r'rooms', views.RoomViewSet)
router.register(r'messages', views.MessageViewSet, basename="message")

urlpatterns=[
  path('', RedirectView.as_view(url='/admin/')),
  path('api/', include(router.urls)),
  path('api/user/', views.get_user),
  path('api/token-auth/', obtain_jwt_token),
]