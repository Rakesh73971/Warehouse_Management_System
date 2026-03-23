from rest_framework import serializers
from .models import Warehouse, StorageType, Zone, Rack, Bin


class StorageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = StorageType
        fields = ['id', 'name', 'temperature_range']


# ── Bin ──────────────────────────────────────────────────────
class BinSerializer(serializers.ModelSerializer):
    rack_code = serializers.CharField(source='rack.rack_code', read_only=True)

    class Meta:
        model  = Bin
        fields = [
            'id', 'rack', 'rack_code',
            'bin_code', 'max_capacity', 'current_capacity',
            'is_available', 'shelf', 'position', 'rfid',
        ]
        read_only_fields = ['is_available']

    def update(self, instance, validated_data):
        instance.current_capacity = validated_data.get(
            'current_capacity', instance.current_capacity
        )
        instance.is_available = instance.current_capacity < instance.max_capacity
        instance.save()
        return instance


# ── Rack ─────────────────────────────────────────────────────
class RackSerializer(serializers.ModelSerializer):
    zone_name        = serializers.CharField(source='zone.name', read_only=True)
    total_bins       = serializers.IntegerField(read_only=True)   # from @property
    occupied_bins    = serializers.IntegerField(read_only=True)
    occupancy_percent = serializers.FloatField(read_only=True)

    class Meta:
        model  = Rack
        fields = [
            'id', 'zone', 'zone_name',
            'rack_code', 'max_capacity',
            'total_bins', 'occupied_bins', 'occupancy_percent',
        ]


# ── Zone ─────────────────────────────────────────────────────
class ZoneSerializer(serializers.ModelSerializer):
    warehouse_name    = serializers.CharField(source='warehouse.name',    read_only=True)
    storage_type_name = serializers.CharField(source='storage_type.name', read_only=True)

    class Meta:
        model  = Zone
        fields = [
            'id', 'warehouse', 'warehouse_name',
            'name', 'description',
            'storage_type', 'storage_type_name',
        ]


# ── Warehouse ─────────────────────────────────────────────────
class WarehouseSerializer(serializers.ModelSerializer):
    manager_name      = serializers.CharField(source='manager.email', read_only=True)
    total_bins        = serializers.IntegerField(read_only=True)
    occupied_bins     = serializers.IntegerField(read_only=True)
    occupancy_percent = serializers.FloatField(read_only=True)

    class Meta:
        model  = Warehouse
        fields = [
            'id', 'name', 'location',
            'manager', 'manager_name',
            'is_active', 'created_at',
            'total_bins', 'occupied_bins', 'occupancy_percent',
        ]
        read_only_fields = ['created_at']