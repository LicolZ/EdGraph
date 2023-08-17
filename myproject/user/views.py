# NeuralNavigate/myproject/user/views.py 

### - handle HTTP requests and responses ###

# Django imports
import os
from django.utils import timezone
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate

# Third-party imports
from rest_framework.parsers import FileUploadParser
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from user.models import CustomUser
from user.models import SavedDefinition
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

# local imports
from scripts.extract_topics import ProcessFile
from user.serializers import UserSerializer
from user.serializers import SavedDefinitionSerializer

from scripts.generate_definitions import generate_personalized_definition


from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.http import require_GET

import logging
logger = logging.getLogger(__name__)

# token-related functions        
def generate_token_for_user(user):
    """Generate JWT token for a user."""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

class SignupView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request):
        # extract email and password from the request data
        email = request.data.get('email')
        password = request.data.get('password')
        
        # check if either email or password is missing
        if not email or not password:
            return JsonResponse({"non_field_errors": ["Missing required fields"]}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # directly get the user instance after saving
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'response': 'Successfully registered a new user.',
                'email': user.email,
                'token': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)
        
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SigninView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')
        
        if not username or not password:
            return JsonResponse({"non_field_errors": ["Missing required fields"]}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        if user:
            user.last_login = timezone.now()
            user.save()
            refresh = RefreshToken.for_user(user)

            # Return tokens in response body to match frontend expectation
            return JsonResponse({
                "user": UserSerializer(user).data,
                "token": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)
            
        return JsonResponse({"non_field_errors": ["Invalid login credentials"]}, status=status.HTTP_401_UNAUTHORIZED)


class UpdateProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        
        user = request.user
        name = request.data.get('name')
        about = request.data.get('about')
        
        if name is not None:
            user.name = name

        if about is not None:
            user.about = about
        
        user.save()

        # return updated user data
        serializer = UserSerializer(user)
        return JsonResponse({"message": "Profile updated successfully", "user": serializer.data}, status=status.HTTP_200_OK)


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
        
        return JsonResponse({'error': 'No file provided'}, status=400)


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_definition(request):

    permission_classes = [permissions.IsAuthenticated]
    topic = request.GET.get('topic')
    if not topic:
        return JsonResponse({"error": "Missing topic parameter."}, status=400)

    user = request.user
    email = user.email
    
    try:
        definition = generate_personalized_definition(topic, email)
        
        return JsonResponse({"definition": definition})
    except Exception as e:
        print("error")
        return JsonResponse({"error": "Failed to generate definition."}, status=500)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def save_definition(request):
    topic = request.data.get('topic')
    definition = request.data.get('definition')
    
    if not topic or not definition:
        return JsonResponse({"error": "Missing topic or definition parameter."}, status=400)

    user = request.user

    try:
        # check if the user has already saved this exact definition for the given topic
        existing_def = SavedDefinition.objects.filter(user=user, topic=topic, definition=definition)
        if not existing_def.exists():
            SavedDefinition.objects.create(user=user, topic=topic, definition=definition)
            # fetch updated definitions after saving
            saved_definitions = SavedDefinition.objects.filter(user=user)
            serializer = SavedDefinitionSerializer(saved_definitions, many=True)
            return JsonResponse({
                "message": "Definition saved successfully.",
                "saved_definitions": serializer.data
            }, status=200)
        else:
            # fetch existing definitions even if not saving new ones
            saved_definitions = SavedDefinition.objects.filter(user=user)
            serializer = SavedDefinitionSerializer(saved_definitions, many=True)
            return JsonResponse({
                "message": "Definition already saved.",
                "saved_definitions": serializer.data
            }, status=400)
    except Exception as e:
        print(e)
        return JsonResponse({"error": "Failed to save definition."}, status=500)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_saved_definitions(request):
    user = request.user
    try:
        saved_definitions = SavedDefinition.objects.filter(user=user)
        serializer = SavedDefinitionSerializer(saved_definitions, many=True)
        return JsonResponse({"definitions": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error fetching saved definitions: {str(e)}")  # Using the logger you already set up
        return JsonResponse({"error": "Failed to fetch definitions."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class HealthCheckFileView(APIView):
#     parser_class = (FileUploadParser)

#     def post(self, request, *args, **kwargs):
#         print("hello world version 1.0!")

#         return JsonResponse({"hello": "world"})
        