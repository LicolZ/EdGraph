from django.contrib.auth.models import User
from rest_framework import serializers

# create a serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
