# settings/development.py
from .base import *
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Serve static files locally in development
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static',]
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
