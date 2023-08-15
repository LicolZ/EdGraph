#  NeuralNavigate/myproject/myproject/settings/production.py

from .base import *
DEBUG = False
ALLOWED_HOSTS = ['neuralnavigate.com', 'www.neuralnavigate.com', 'neuralnavigate-prod-env.eba-jpr6yccf.us-west-1.elasticbeanstalk.com']
# CORS
CORS_ALLOWED_ORIGINS = [
    "https://neuralnavigate.com",
    "https://www.neuralnavigate.com",
    # any other domains want to whitelist?
]

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

# AWS settings
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
AWS_DEFAULT_ACL = 'public-read'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_LOCATION = 'static'
