# settings/production.py
from .base import *
DEBUG = False
ALLOWED_HOSTS = ['neuralnavigate.com', 'www.neuralnavigate.com', 'neuralnavigate-prod-env.eba-jpr6yccf.us-west-1.elasticbeanstalk.com']

# Amazon RDS database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv("RDS_DB_NAME", "default_db_name"),
        'USER': os.getenv("RDS_DB_USER", "default_user"),
        'PASSWORD': os.getenv("RDS_DB_PASSWORD", "default_password"),
        'HOST': os.getenv("RDS_DB_HOST", "default_host"),
        'PORT': os.getenv("RDS_PORT", "5432"),

    }
}

