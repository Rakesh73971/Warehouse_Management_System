import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from products.models import Product,Category
from orders.models import SalesOrder,SalesOrderItem
from warehouse.models import StorageType


User = get_user_model()

@pytest.fixture
def manager_user(db):
    return User.objects.create(
        email='manager@gmail.com',
        full_name='Test Manager',
        password='password123',
        role='MANAGER'
    )

@pytest.fixture
def auth_client(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    return client

@pytest.fixture
def salesorder(db):
    return SalesOrder.objects.create(
        order_number='OR1010',
        customer_name='Rakesh',
        status='COMPLETED'
    )

@pytest.fixture
def category(db):
    return Category.objects.create(
        name='fruits'
    )

@pytest.fixture
def storage_type(db):
    return StorageType.objects.create(
        name='Cold Storage',
        temperature_range='10 to 25c'
    )


@pytest.fixture
def product(category,storage_type):
    return Product.objects.create(
        name='Banana',
        sku='Ba1012',
        category=category,
        storage_type=storage_type
    )

@pytest.fixture
def salesorderitem(salesorder,product):
    return SalesOrderItem.objects.create(
        order=salesorder,
        product=product,
        quantity=2
    )