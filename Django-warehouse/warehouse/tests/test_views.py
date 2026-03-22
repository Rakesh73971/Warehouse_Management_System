from warehouse.models import Warehouse,Rack,Bin,StorageType,Zone

# -----------------
# WAREHOUSE TEST
# -----------------
def test_create_warehouse(auth_client,manager_user):
    response = auth_client.post(
        '/api/warehouse/warehouses/',
        {
            "name":"Main Warehouse",
            "location":"Hyderabad",
            "manager":manager_user.id
        },
        format='json'
    )

    assert response.status_code == 201
    assert Warehouse.objects.count() == 1

def test_filter_warehouse_by_location(auth_client,manager_user):
    Warehouse.objects.create(name='W1',location='Delhi',manager=manager_user)
    Warehouse.objects.create(name='W2',location='Hyderabad',manager=manager_user)

    response = auth_client.get('/api/warehouse/warehouses/?location=Delhi')

    assert response.status_code == 200
    assert len(response.data) == 1

# ------------------
# STORAGE TYPE TEST
# ------------------
def test_create_storage_type(auth_client):
    response = auth_client.post(
        '/api/warehouse/storagetypes/',
        {
            'name':'Dry Storage',
            'temperature_range':'10 to 25c'
        },
        format='json'
    )

    assert response.status_code == 201
    assert StorageType.objects.count() == 1

# ----------------
# ZONE TEST
# ----------------
def test_create_zone(auth_client,warehouse,storage_type):
    response = auth_client.post(
        '/api/warehouse/zones/',
        {
            'name':'Zone A',
            'warehouse':warehouse.id,
            'storage_type':storage_type.id
        },
        format='json'
    )
    assert response.status_code == 201
    assert Zone.objects.count() == 1

# -----------
# RACK TEST
# -----------
def test_create_rack(auth_client,zone):
    response = auth_client.post(
        '/api/warehouse/racks/',
        {
            'zone':zone.id,
            'rack_code':'R001',
            'max_capacity':100
        },
        format='json'
    )
    assert response.status_code == 201
    assert Rack.objects.count() == 1

# -----------
# BIN TEST
# -----------
def test_create_bin(auth_client,rack):
    response = auth_client.post(
        '/api/warehouse/bins/',
        {
            'bin_code':'BIN001',
            'max_capacity':100,
            'current_capacity':50,
            'rack':rack.id
        },
        format='json'
    )

    assert response.status_code == 201
    assert Bin.objects.count() == 1

# -----------
# AUTH TEST
# ----------
def test_unauthenticated_access(manager_user):
    from rest_framework.test import APIClient

    client = APIClient()
    response = client.post('/api/warehouse/warehouses/')
    assert response.status_code == 401

