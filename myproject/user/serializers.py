# serializers.py

from rest_framework import serializers
from .models import CustomUser  

class UserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = CustomUser 
        fields = ('id', 'email', 'password')
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

