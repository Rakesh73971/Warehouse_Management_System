from rest_framework import serializers
from django.db import transaction
from .models import Category,Product,Inventory,StockMovement

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name',read_only=True)
    storage_type_name = serializers.CharField(source='storage_type.name',read_only=True)
    class Meta:
        model = Product
        fields = ['id','name','sku','description','storage_type','storage_type_name','category','category_name','weight','created_at']

class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name',read_only=True)
    bin_code = serializers.CharField(source='bin.bin_code',read_only=True)
    class Meta:
        model = Inventory
        fields = ['id','product','product_name','bin','bin_code','quantity']

class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    bin_code = serializers.CharField(source='bin.bin_code', read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            'id',
            'product',
            'product_name',
            'bin',
            'bin_code',
            'quantity',
            'movement_type',
            'created_at'
        ]

    @transaction.atomic
    def create(self, validated_data):
        movement = StockMovement.objects.create(**validated_data)

        product = movement.product
        bin_obj = movement.bin
        qty = movement.quantity

        inventory, created = Inventory.objects.get_or_create(
            product=product,
            bin=bin_obj,
            defaults={'quantity': 0}
        )

        if movement.movement_type == 'INBOUND':
            inventory.quantity += qty
            bin_obj.current_capacity += qty

        elif movement.movement_type == 'OUTBOUND':
            if inventory.quantity < qty:
                raise serializers.ValidationError(
                    "Not enough stock for OUTBOUND."
                )
            inventory.quantity -= qty
            bin_obj.current_capacity -= qty

        # Prevent overfill
        if bin_obj.current_capacity > bin_obj.max_capacity:
            raise serializers.ValidationError(
                "Bin capacity exceeded."
            )

        inventory.save()
        bin_obj.save()

        return movement