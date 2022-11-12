
from channels.routing import ProtocolTypeRouter, URLRouter
# import app.routing
from django.urls import path
from chat_django.consumers import ChatConsumer, HomeConsumer

websocket_urlpatterns = [
    path("<room_id>/", ChatConsumer.as_asgi()),
    path("room/add/", HomeConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket':
        URLRouter(
            websocket_urlpatterns
        )
    ,
})