### views.py - handle HTTP requests and responses ###

# Django imports
import os
import datetime
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# Third-party imports
from rest_framework.parsers import FileUploadParser
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from user.models import CustomUser


# Local imports
from scripts.extract_topics import ProcessFile
from user.serializers import UserSerializer

def generate_token_for_user(user):
    """Generate JWT token for a user."""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        data = {}
        email = request.data.get('email')

        # Check for email uniqueness here first
        if CustomUser.objects.filter(email=email).exists():
            data['error'] = "A user is already registered with this e-mail address."
            return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            try:
                user = serializer.save()
                data['response'] = "Successfully registered a new user."
                data['email'] = user.email
                data["token"] = generate_token_for_user(user)
            except Exception as e:
                print("hello")
                data['error'] = str(e)
                return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            data['error'] = "Please enter a valid email address."
            print(serializer.errors)

        return JsonResponse(data)




class SigninView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            user.last_login = datetime.datetime.now()
            user.save()
            token = generate_token_for_user(user)
            return JsonResponse({"token": token}, status=status.HTTP_200_OK)
        
        return JsonResponse({"detail": "Invalid login credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ProcessFileView(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request):
        file = request.data.get('file')
        if file:
            file_path = default_storage.save('temp.pdf', file)
            process_file = ProcessFile(file_path)
            topics = process_file.extract_topics()
            relationships = process_file.fetch_topic_relationships(topics)
            return JsonResponse({"topics": topics, "relationships": relationships})
        
        return JsonResponse({'error': 'No file provided'}, status=400)

# class HealthCheckFileView(APIView):
#     parser_class = (FileUploadParser)

#     def post(self, request, *args, **kwargs):
#         print("hello world version 1.0!")

#         return JsonResponse({"hello": "world"})
        