import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from products.models import Category,Product,Inventory,StockMovement
from warehouse.models import StorageType,Bin,Rack,Warehouse,Zone

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
        sku='BA0101',
        storage_type=storage_type,
        category=category
    )

@pytest.fixture
def warehouse(manager_user):
    return Warehouse.objects.create(
        name='Main Warehouse',
        location='Hyderabad',
        manager=manager_user
    )


@pytest.fixture
def storage_type(db):
    return StorageType.objects.create(
        name="Cold Storage",
        temperature_range="10 to 25°C",
    )



@pytest.fixture
def zone(warehouse,storage_type):
    return Zone.objects.create(
        warehouse=warehouse,
        name='Zone A',
        description='Test zone',
        storage_type=storage_type
    )



@pytest.fixture
def rack(zone):
    return Rack.objects.create(
        zone=zone,
        rack_code='R001',
        max_capacity=100
    )



@pytest.fixture
def bin_instance(rack):
    return Bin.objects.create(
        rack=rack,
        bin_code='B001',
        max_capacity=100,
        current_capacity=50
    )

@pytest.fixture
def inventory(product,bin_instance):
    return Inventory.objects.create(
        product=product,
        bin=bin_instance,
        quantity=10
    )

@pytest.fixture
def stockmovement(product,bin_instance):
    return StockMovement.objects.create(
        product=product,
        bin=bin_instance,
        quantity=5,
        movement_type='INBOUND'
    )