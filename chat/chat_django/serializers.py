
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import User, Room, Message
from rest_framework_jwt.settings import api_settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    class Meta:
        model = Message
        fields = ('text', 'time', 'user', 'room', 'username', 'read')