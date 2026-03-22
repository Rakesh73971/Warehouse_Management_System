from django.contrib import admin
from .models import Category,Product,Inventory,StockMovement

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    list_filter = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name','sku','description','storage_type','category','weight','created_at']
    list_editable = ['description','weight']
    list_filter = ['storage_type','category']

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['product','bin','quantity']
    list_editable = ['quantity']
    list_filter = ['bin']

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['bin','quantity','movement_type','created_at']
    list_editable = ['quantity','movement_type']
    list_filter = ['movement_type','created_at']