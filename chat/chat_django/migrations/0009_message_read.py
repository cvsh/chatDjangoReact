# Generated by Django 3.2.16 on 2022-11-09 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_django', '0008_auto_20221109_1248'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='read',
            field=models.BooleanField(default=False),
        ),
    ]
