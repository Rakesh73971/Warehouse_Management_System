import pytest
from django.contrib.auth import get_user_model
from warehouse.models import Warehouse,StorageType,Zone,Rack,Bin
from rest_framework.test import APIClient

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
def warehouse(manager_user):
    return Warehouse.objects.create(
        name='Main Warehouse',
        location='Hyderabad',
        manager=manager_user
    )


@pytest.fixture
def storage_type(db):
    return StorageType.objects.create(
        name="Dry Storage",
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