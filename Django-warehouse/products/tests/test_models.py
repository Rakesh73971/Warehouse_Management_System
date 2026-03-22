
def test_category(category):
    assert category.name == 'fruits'


def test_product_model(product):

    assert product.category.name == 'fruits'
    assert product.name == 'Banana'
    assert product.storage_type.name == 'Cold Storage'

def test_inventory_model(inventory):

    assert inventory.product.name == 'Banana'
    assert inventory.bin.rack.zone.warehouse.name == 'Main Warehouse'


def test_stockmovement_model(stockmovement):
    assert stockmovement.product.name == 'Banana'
    assert stockmovement.quantity == 5
    assert stockmovement.bin.rack.zone.warehouse.name == 'Main Warehouse'
    assert stockmovement.bin.rack.zone.warehouse.manager.full_name == 'Test Manager'