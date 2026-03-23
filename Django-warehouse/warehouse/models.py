from django.db import models
from django.conf import settings
from django.db.models import Q, F


class Warehouse(models.Model):
    name       = models.CharField(max_length=255)
    location   = models.CharField(max_length=255)
    manager    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='managed_warehouse'
    )
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def total_bins(self):
        return Bin.objects.filter(rack__zone__warehouse=self).count()

    @property
    def occupied_bins(self):
        return Bin.objects.filter(rack__zone__warehouse=self, is_available=False).count()

    @property
    def occupancy_percent(self):
        total = self.total_bins
        return round((self.occupied_bins / total) * 100, 1) if total > 0 else 0


class StorageType(models.Model):
    name              = models.CharField(max_length=255)
    temperature_range = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Zone(models.Model):
    warehouse    = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='zones')
    name         = models.CharField(max_length=255)
    description  = models.TextField(blank=True)
    storage_type = models.ForeignKey(StorageType, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.warehouse.name} - {self.name}"


class Rack(models.Model):
    zone         = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name='racks')
    rack_code    = models.CharField(max_length=255)   
    max_capacity = models.IntegerField()

    def __str__(self):
        return f"Rack {self.rack_code}"

    @property
    def total_bins(self):
        return self.bins.count()

    @property
    def occupied_bins(self):
        return self.bins.filter(is_available=False).count()

    @property
    def occupancy_percent(self):
        total = self.total_bins
        return round((self.occupied_bins / total) * 100, 1) if total > 0 else 0


class Bin(models.Model):
    rack             = models.ForeignKey('Rack', on_delete=models.CASCADE, related_name='bins')
    bin_code         = models.CharField(max_length=255)
    max_capacity     = models.IntegerField()
    current_capacity = models.IntegerField(default=0)
    is_available     = models.BooleanField(default=True)

    
    shelf    = models.CharField(max_length=50, blank=True, default='')   
    position = models.IntegerField(null=True, blank=True)              
    rfid     = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(current_capacity__gte=0) & Q(current_capacity__lte=F('max_capacity')),
                name='valid_bin_capacity'
            )
        ]
        ordering = ['shelf', 'position']   

    def save(self, *args, **kwargs):
        self.is_available = self.current_capacity < self.max_capacity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Bin {self.bin_code}"