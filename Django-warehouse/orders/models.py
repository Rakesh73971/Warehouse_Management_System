from django.db import models
from products.models import Product

# Create your models here.
class SalesOrder(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        COMPLETED = "COMPLETED", "Completed"
    order_number = models.CharField(max_length=100,unique=True)
    customer_name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

class SalesOrderItem(models.Model):
    order = models.ForeignKey(SalesOrder,on_delete=models.CASCADE,related_name='salesorders')
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.IntegerField()
