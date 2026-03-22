def test_create_warehouse(warehouse):
    assert warehouse.manager.email == 'manager@gmail.com'
    assert str(warehouse) == 'Main Warehouse'


def test_storage_type(storage_type):
    assert storage_type.name == "Dry Storage"
    assert storage_type.temperature_range == "10 to 25°C"

def test_zone_creation(zone):
    assert zone.warehouse.name == 'Main Warehouse'
    assert zone.storage_type.name == 'Dry Storage'
    assert str(zone) == 'Main Warehouse - Zone A'

def test_rack_creation(rack):
    assert rack.zone.warehouse.name == 'Main Warehouse'
    assert str(rack) == 'Rack R001'

def test_bin_creation(bin_instance):
    assert bin_instance.is_available is True

    bin_instance.current_capacity = 100
    bin_instance.save()
    bin_instance.refresh_from_db()

    assert bin_instance.is_available is False

