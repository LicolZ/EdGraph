from rest_framework import serializers
from django.core.validators import validate_email
from .models import CustomUser  

class UserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = CustomUser 
        fields = ('id', 'email', 'password')

    def validate_email(self, value):
        """
        This will just validate that the email has the correct format.
        """
        # Use Django's built-in email validator.
        # If the email isn't valid, it'll raise a ValidationError.
        validate_email(value)
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
