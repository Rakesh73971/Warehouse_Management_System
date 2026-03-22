from rest_framework import generics,permissions
from .models import User
from .serializers import RegisterSerializer,UserSerializer
from .permissions import IsAdmin
from .pagination import DefaultPageSize
# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = DefaultPageSize
    

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    pagination_class = DefaultPageSize