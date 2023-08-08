### views.py - handle HTTP requests and responses ###

import os
from django.http import JsonResponse
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.storage import default_storage

from myproject.scripts.extract_topics import ProcessFile

class ProcessFileView(APIView):
    parser_class = (FileUploadParser)

    def post(self, request, *args, **kwargs):
        file = request.data.get('file')
        if file:
            # Save the file temporarily
            file_path = default_storage.save('temp.pdf', file)
            # Process the file

            process_file = ProcessFile(file_path)

            # get topics
            topics = process_file.extract_topics()

            # get relationships between topics
            relationships = process_file.fetch_topic_relationships(topics)

            # Return the topics and relationships in a JSON response
            return JsonResponse({"topics": topics, "relationships": relationships})
        else:
            return Response({'error': 'No file provided'}, status=400)
        
# class HealthCheckFileView(APIView):
#     parser_class = (FileUploadParser)

#     def post(self, request, *args, **kwargs):
#         print("hello world version 1.0!")

#         return JsonResponse({"hello": "world"})
        