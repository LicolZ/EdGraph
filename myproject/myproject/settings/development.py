# NeuralNavigate/myproject/myproject/settings/development.py
from .base import *
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
# CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_ALL_ORIGINS = True


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


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
