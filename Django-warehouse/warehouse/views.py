from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Warehouse, Zone, Rack, Bin, StorageType
from .serializers import (WarehouseSerializer, ZoneSerializer,
                           RackSerializer, BinSerializer, StorageTypeSerializer)
from .pagination import DefaultPageSize


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset           = Warehouse.objects.select_related('manager').all()
    serializer_class   = WarehouseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [DjangoFilterBackend]
    pagination_class   = DefaultPageSize
    filterset_fields   = ['is_active', 'location']


class ZoneViewSet(viewsets.ModelViewSet):
    queryset           = Zone.objects.select_related('warehouse', 'storage_type').all()
    serializer_class   = ZoneSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [DjangoFilterBackend]
    pagination_class   = DefaultPageSize
    filterset_fields   = ['warehouse', 'storage_type']   


class RackViewSet(viewsets.ModelViewSet):
    queryset           = Rack.objects.select_related('zone').all()
    serializer_class   = RackSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [DjangoFilterBackend]
    pagination_class   = DefaultPageSize
    filterset_fields   = ['zone']                        


class BinViewSet(viewsets.ModelViewSet):
    queryset           = Bin.objects.select_related('rack').all()
    serializer_class   = BinSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [DjangoFilterBackend]
    pagination_class   = DefaultPageSize
    filterset_fields   = ['rack', 'is_available']        


class StorageTypeViewSet(viewsets.ModelViewSet):
    queryset           = StorageType.objects.all()
    serializer_class   = StorageTypeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class   = DefaultPageSize