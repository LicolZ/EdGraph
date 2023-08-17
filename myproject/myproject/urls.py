"""
root URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# NeuralNavigate/myproject/myproject/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from user.views import SignupView, SigninView, ProcessFileView, UpdateProfileView, get_definition, save_definition, get_saved_definitions

urlpatterns = [
    path('process/', ProcessFileView.as_view(), name='process_file'),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),  # DRF's built-in views
    path('api/token-auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/signin/', SigninView.as_view(), name='signin'),
    path('update-profile/', UpdateProfileView.as_view(), name='update_profile'),
    path('api/get-definition/', get_definition, name='get_definition'), 
    path('api/save-definition/', save_definition, name='save_definition'), 
    path('api/get-saved-definitions/', get_saved_definitions, name='get_saved_definitions'),

    # path('healthcheck/', HealthCheckFileView.as_view(), name='health_check'),
]
