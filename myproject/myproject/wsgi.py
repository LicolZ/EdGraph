# NeuralNavigate/myproject/myproject/wsgi.py

"""
WSGI config for myproject project.

entry point for WSGI-compatible web servers to serve the Django project. 
 ---> Crucial for deploying to production

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import nltk

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings." + os.environ.get("DJANGO_ENV", "development"))

nltk.download('punkt')

application = get_wsgi_application()
