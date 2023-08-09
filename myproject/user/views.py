### views.py - handle HTTP requests and responses ###

import os
from django.http import JsonResponse
from rest_framework.parsers import FileUploadParser
from rest_framework.views import APIView
from django.core.files.storage import default_storage
# processing file imports
from scripts.extract_topics import ProcessFile

# user authentication imports
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.settings import api_settings
from rest_framework import status


from user.serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        print("successfully serialized")
        print(request.data)
        data = {}
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                print("serializer is valid")
                data['response'] = "Successfully registered a new user."
                print("successfully registered a new user")
                data['email'] = user.email
                print("successfully set email")
                refresh = RefreshToken.for_user(user)
                print("successfully refreshed token")
                token = str(refresh.access_token)
                data["token"] = token
                print("set token")
            except Exception as e:
                data['error'] = str(e)
                print("error:", str(e))
        else:
            data = serializer.errors
            print("serializer errors")
            print(serializer.errors)
        return JsonResponse(data)


class SigninView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            return JsonResponse({"token": token}, status=status.HTTP_200_OK)
        
        # If authentication fails, return a generic error message.
        return JsonResponse({"detail": "Invalid login credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ProcessFileView(APIView):
    parser_class = (FileUploadParser)

    def post(self, request):
        file = request.data.get('file')
        if file:
            file_path = default_storage.save('temp.pdf', file)
            process_file = ProcessFile(file_path)
            topics = process_file.extract_topics()
            relationships = process_file.fetch_topic_relationships(topics)
            return JsonResponse({"topics": topics, "relationships": relationships})
        else:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
# class HealthCheckFileView(APIView):
#     parser_class = (FileUploadParser)

#     def post(self, request, *args, **kwargs):
#         print("hello world version 1.0!")

#         return JsonResponse({"hello": "world"})
        