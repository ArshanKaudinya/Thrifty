"""
URL configuration for thrifty project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static

# Temporary view to handle root URL (you can change this later to serve React or do a redirect)
def index(request):
    return HttpResponse("Welcome to Thrifty API. Use the /api/ endpoint for data.")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('market.urls')),  # Include market URLs under /api/
    path('', index),  # Handle the root URL
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)