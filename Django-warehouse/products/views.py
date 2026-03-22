from rest_framework import viewsets
from .models import Product,Category,Inventory,StockMovement
from .serializers import ProductSerializer,CategorySerializer,InventorySerializer,StockMovementSerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from django.core.cache import cache
from django.utils.decorators import method_decorator
from .pagination import DefaultPageSize


class CacheListMixin:
    @method_decorator(cache_page(60*5))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)
    

    @method_decorator(cache_page(60*5))
    @method_decorator(vary_on_headers('Authorization'))
    def retrieve(self,request,*args,**kwargs):
        return super().retrieve(request,*args,**kwargs)
# Create your views here.
class CategoryViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    pagination_class = DefaultPageSize
    filterset_fields = {
        'name': ['exact', 'icontains'],
    }

class ProductViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category','storage_type').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    pagination_class = DefaultPageSize
    filterset_fields = {
        'name': ['exact', 'icontains'],
        'category': ['exact'],
        'storage_type': ['exact'],
    }
    def perform_create(self, serializer):
        serializer.save()
        cache.clear()

    def perform_update(self, serializer):
        serializer.save()
        cache.clear()

    def perform_destroy(self, instance):
        instance.delete()
        cache.clear()

class InventoryViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = Inventory.objects.select_related('product','bin').all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    pagination_class = DefaultPageSize
    filterset_fields = ['product','bin']

class StockMovementViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = StockMovement.objects.select_related('product','bin').all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    pagination_class =DefaultPageSize
    filterset_fields = {
        'product': ['exact'],
        'bin': ['exact'],
        'movement_type': ['exact'],
        'created_at': ['date', 'date__gte', 'date__lte']
    }

