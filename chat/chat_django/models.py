
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class Room(models.Model):
    name = models.CharField(verbose_name="Room name", max_length=255, unique=True)
    users = models.ManyToManyField(User, blank=True, related_name='+')

    def __str__(self):
        return self.name

class Message(models.Model):
    text = models.TextField(verbose_name="Message text", max_length=1024)
    time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, verbose_name="User", on_delete=models.CASCADE)
    room = models.ForeignKey(Room, verbose_name="Room", on_delete=models.CASCADE)
    read = models.BooleanField(default=False)


    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ["time"]

    def __str__(self):
        return self.text[:7]
