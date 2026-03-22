from django.db import models
from warehouse.models import StorageType,Bin

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100,unique=True)
    description = models.TextField(blank=True)
    storage_type = models.ForeignKey(
        StorageType,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="products"
    )

    weight = models.FloatField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}-{self.sku}"
    
class Inventory(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    bin = models.ForeignKey(Bin,on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    class Meta:
        unique_together = ('product','bin')

class StockMovement(models.Model):
    MOVEMENT_TYPE = (
        ('INBOUND','Inbound'),
        ('OUTBOUND','Outbound')
    )
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    bin = models.ForeignKey(Bin,on_delete=models.CASCADE)
    quantity = models.IntegerField()
    movement_type = models.CharField(max_length=10,choices=MOVEMENT_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)