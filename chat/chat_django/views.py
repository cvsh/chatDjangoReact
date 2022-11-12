
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import UserSerializer, RoomSerializer, MessageSerializer
from .models import Room, Message

@api_view(['GET'])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Message.objects.all()
        room = self.request.query_params.get('room')
        if room is not None:
            queryset = Message.objects.filter(room_id=room)
        return queryset
