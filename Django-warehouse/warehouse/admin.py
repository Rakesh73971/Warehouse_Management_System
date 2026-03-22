from django.contrib import admin
from . import models

# Register your models here.
@admin.register(models.Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ['name','location','manager','is_active','created_at']
    list_filter = ['location','manager']
    list_editable = ['manager','is_active']


@admin.register(models.Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ['warehouse','name','description','storage_type']
    list_filter = ['warehouse','storage_type']
    list_editable = ['name']

@admin.register(models.Rack)
class RackAdmin(admin.ModelAdmin):
    list_display = ['zone','rack_code','max_capacity']
    list_filter = ['rack_code','max_capacity']
    list_editable = ['max_capacity']

@admin.register(models.Bin)
class BinAdmin(admin.ModelAdmin):
    list_display = ['rack','bin_code','current_capacity','is_available']
    list_filter = ['bin_code','current_capacity','is_available']
    list_editable = ['bin_code','current_capacity','is_available']

@admin.register(models.StorageType)
class StoragTypeAdmin(admin.ModelAdmin):
    list_display = ['name','temperature_range']
    list_filter = ['temperature_range']
    list_editable = ['temperature_range']