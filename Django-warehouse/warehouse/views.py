from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from .models import Warehouse,Zone,Rack,Bin,StorageType
from .serializers import WarehouseSerializer,ZoneSerializer,RackSerializer,BinSerializer,StorageTypeSerializer
from accounts.permissions import IsAdmin,IsManager
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.views.decorators.vary import vary_on_headers
from django.core.cache import cache
from .pagination import DefaultPageSize

class CacheListMixin:

    @method_decorator(cache_page(60 * 5))
    @method_decorator(vary_on_headers("Authorization"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

#Warehouse Viewset
class WarehouseViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = Warehouse.objects.select_related('manager').all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    pagination_class = DefaultPageSize
    filterset_fields = ['is_active','location']


#Zone ViewSet
class ZoneViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = Zone.objects.select_related('warehouse','storage_type').all()
    serializer_class = ZoneSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    pagination_class = DefaultPageSize
    filterset_fields = ['warehouse','storage_type']

    

# Rack ViewSet
class RackViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = Rack.objects.select_related('zone').all()
    serializer_class = RackSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    pagination_class = DefaultPageSize
    filterset_fields = ['zone']


# Bin Viewset
class BinViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = Bin.objects.select_related('rack').all()
    serializer_class = BinSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    pagination_class = DefaultPageSize
    filterset_fields = ['rack','is_available']



class StorageTypeViewSet(CacheListMixin,viewsets.ModelViewSet):
    queryset = StorageType.objects.all()
    serializer_class = StorageTypeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DefaultPageSize