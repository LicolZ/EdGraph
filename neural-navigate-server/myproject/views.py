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
            print(f'Received file with name {file.name}')
            # Save the file temporarily
            file_path = default_storage.save('temp.pdf', file)
            # Process the file and get the topics
            process_file = ProcessFile(file_path)
            topics = process_file.extract_topics()
            # Return the topics in a JSON response
            return JsonResponse({"topics": topics})
        else:
            return Response({'error': 'No file provided'}, status=400)