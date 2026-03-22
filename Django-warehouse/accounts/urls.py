from django.urls import  path
from .views import UserListView,RegisterView
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('users/',UserListView.as_view(),name='users'),
    path('login/',TokenObtainPairView.as_view(),name='token_object_pair'),
    path('refresh/',TokenRefreshView.as_view(),name='token_refresh')
]