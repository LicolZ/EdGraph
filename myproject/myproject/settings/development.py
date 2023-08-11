# settings/development.py
from .base import *
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]

# Local PostgreSQL database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'neural_navigate_users',
        'USER': 'postgres',
        'PASSWORD': 'neuralnavigatedatabase354',  # set this when ready
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Serve static files locally in development
STATIC_URL = '/collected_static/'
STATICFILES_DIRS = [BASE_DIR / 'static_src',]
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
