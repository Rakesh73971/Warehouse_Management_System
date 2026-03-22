from django.contrib import admin
from .models import SalesOrder,SalesOrderItem

# Register your models here.
@admin.register(SalesOrder)
class SalesOrderAdmin(admin.ModelAdmin):
    list_display = ['order_number','customer_name','status','created_at']
    list_filter = ['order_number','status','created_at']
    list_editable = ['status']

@admin.register(SalesOrderItem)
class SalesOrderItemAdmin(admin.ModelAdmin):
    list_display = ['order','product','quantity']
    list_filter = ['order','quantity']