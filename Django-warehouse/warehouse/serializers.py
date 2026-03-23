from rest_framework import serializers
from .models import Warehouse,StorageType,Zone,Rack,Bin


class BinSerializer(serializers.ModelSerializer):
    rack_code = serializers.CharField(source='rack.rack_code',read_only=True)
    class Meta:
        model = Bin
        fields = ['id','rack','rack_code','bin_code','max_capacity','current_capacity','is_available']
        read_only_fields = ['is_available']

    def update(self, instance, validated_data):
        current_capacity = validated_data.get(
            'current_capacity',
            instance.current_capacity
        )
        instance.current_capacity = current_capacity

        if instance.current_capacity >= instance.max_capacity:
            instance.is_available = False
        else:
            instance.is_available = True
        instance.save()
        return instance


class RackSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    bins = BinSerializer(many=True, read_only=True)   # 🔥 ADD THIS

    class Meta:
        model = Rack
        fields = [
            'id',
            'zone',
            'zone_name',
            'rack_code',
            'max_capacity',
            'bins'  
        ]

class ZoneSerializer(serializers.ModelSerializer):
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    storage_type_name = serializers.CharField(source='storage_type.name', read_only=True)

    racks = RackSerializer(many=True, read_only=True)   

    class Meta:
        model = Zone
        fields = [
            'id',
            'warehouse',
            'warehouse_name',
            'name',
            'description',
            'storage_type',
            'storage_type_name',
            'racks'   
        ]

class WarehouseSerializer(serializers.ModelSerializer):
    manager_email = serializers.CharField(source='manager.email', read_only=True)

    zones = ZoneSerializer(many=True, read_only=True)  

    class Meta:
        model = Warehouse
        fields = [
            'id',
            'name',
            'location',
            'manager',
            'manager_email',
            'is_active',
            'created_at',
            'zones'   
        ]
        read_only_fields = ['created_at']


class StorageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageType
        fields = ['id','name','temperature_range']
        
