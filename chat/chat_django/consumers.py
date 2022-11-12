
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message, Room
from django.contrib.auth.models import User
from django.db.models import Q

class ChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room = None
        self.chat = None

    def connect(self):
        self.accept()
        self.id = f"{self.scope['url_route']['kwargs']['room_id']}"
        self.room = Room.objects.get(id=self.id)

        async_to_sync(self.channel_layer.group_add)(
            self.id,
            self.channel_name,
        )

    def disconnect(self, code):
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        user_inst = User.objects.get(id=content["user"])
        if content['type'] == "reading":
            mymessages = Message.objects.filter(~Q(user=content['user']))
            mymessages.update(read=True)
            self.room.users.add(user_inst)

            async_to_sync(self.channel_layer.group_send)(
                self.id,
                {
                    'type': 'read',
                    'read': True,
                    "users": self.room.users.count()
                },
            )

        if content['type'] == "chat_broadcast":    
            Message.objects.create(
                user=user_inst,
                text=content["text"],
                room=self.room,
                time=content["time"],
                read=True
            )
            async_to_sync(self.channel_layer.group_send)(
                self.id,
                {
                    'type': 'chat_broadcast',
                    'user': user_inst.id,
                    'text': content['text'],
                    'room': content['room'],
                    'time': content['time'],
                    'username': user_inst.username,
                    'read': True,
                },
            )
        return super().receive_json(content, **kwargs)

    def read(self, event):
        self.send_json(event)

    def chat_broadcast(self, event):
        self.send_json(event)

class HomeConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

    def connect(self):
        self.accept()
        self.name = 'home'

        async_to_sync(self.channel_layer.group_add)(
            self.name,
            self.channel_name,
        )

    def disconnect(self, code):
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        async_to_sync(self.channel_layer.group_send)(
            self.name,
            {
                'type': 'chat_broadcast',
                'update': True,
                'name': content['name']
            },
        )

        return super().receive_json(content, **kwargs)

    def chat_broadcast(self, event):
        self.send_json(event)