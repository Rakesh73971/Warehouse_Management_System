from django.db import transaction
from rest_framework.exceptions import ValidationError
from products.models import Inventory, StockMovement


@transaction.atomic
def confirm_sales_order(order):

    # Prevent double confirmation
    if order.status == order.Status.COMPLETED:
        raise ValidationError("Order is already completed.")

    if order.status == order.Status.REJECTED:
        raise ValidationError("Rejected order cannot be completed.")

    for item in order.items.all():

        try:
            inventory = Inventory.objects.select_for_update().get(
                product=item.product
            )
        except Inventory.DoesNotExist:
            raise ValidationError(
                f"No inventory found for product {item.product.name}"
            )

        # Stock validation
        if inventory.quantity < item.quantity:
            raise ValidationError(
                f"Insufficient stock for {item.product.name}"
            )

        # Deduct stock
        inventory.quantity -= item.quantity
        inventory.save()

        # Create stock movement
        StockMovement.objects.create(
            product=item.product,
            quantity=item.quantity,
            movement_type=StockMovement.MovementType.OUT  # if you use choices
        )

    order.status = order.Status.COMPLETED
    order.save()