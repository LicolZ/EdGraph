# NeuralNavigate/myproject/user/serializers.py
from rest_framework import serializers
from django.core.validators import validate_email
from .models import CustomUser  

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = CustomUser 
        fields = ('id', 'email', 'password', 'name', 'about')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        print("Inside validate_email")  # Check if this is printed
        exists_query = CustomUser.objects.filter(email=value)
        
        if self.instance:
            exists_query = exists_query.exclude(id=self.instance.id)
        if exists_query.exists():
            raise serializers.ValidationError("A user is already registered with this e-mail address")
        return value

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


    # def update(self, instance, validated_data):
    #     # password requires special treatment
    #     password = validated_data.pop('password', None)

    #     # this is the standard way of updating model fields using a serializer
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)

    #     # save  updates
    #     instance.save()

    #     # handle password separately so it gets hashed
    #     if password:
    #         instance.set_password(password)
    #         instance.save()

    #     return instance
