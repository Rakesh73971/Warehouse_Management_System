from rest_framework import serializers
from .models import SalesOrder,SalesOrderItem

class SalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrder
        fields = ['order_number','customer_name','status','created_at']

class SalesOrderItemSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = SalesOrderItem
        fields = [
            'order',
            'order_number',
            'product',
            'product_name',
            'quantity'
        ]