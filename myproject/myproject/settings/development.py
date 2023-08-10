# settings/development.py
from .base import *
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# Local PostgreSQL database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'neural_navigate_users',
        'USER': 'postgres',
        'PASSWORD': 'your_password',  # set this when ready
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Serve static files locally in development
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static',]
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

