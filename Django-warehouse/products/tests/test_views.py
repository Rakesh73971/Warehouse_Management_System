
from products.models import Category,Product,Inventory,StockMovement


    # --------------
    # CATEGORY TEST
    # --------------
def test_create_category(auth_client):
    response = auth_client.post(
        '/api/product/categories/',
        {
            'name':'clothes'
        },
        format='json'
    )
    assert response.status_code == 201
    assert Category.objects.count() == 1

# -------------
# PRODUCT TEST
# -------------
def test_create_product(auth_client,category,storage_type):
    response = auth_client.post(
        '/api/product/products/',
        {
            'name':'banana',
            'sku':'BAN001',
            'storage_type':storage_type.id,
            'category':category.id
        },
        format='json'
    )

    assert response.status_code == 201
    assert Product.objects.count() == 1

# ---------------
# INVENTORY TEST
# ---------------
def test_create_inventory(auth_client,product,bin_instance):
    
    response = auth_client.post(
        '/api/product/inventories/',
        {
            'product':product.id,
            'bin':bin_instance.id,
            'quantity':5
        },
        format='json'
    )

    assert response.status_code == 201
    assert Inventory.objects.count() == 1

def test_create_stockmovement(auth_client,product,bin_instance):
    
    response = auth_client.post(
        '/api/product/stockmovements/',
        {
            'product':product.id,
            'bin':bin_instance.id,
            'quantity':5,
            'movement_type':'INBOUND'
        },
        format='json'
    )
    assert response.status_code == 201
    assert StockMovement.objects.count() == 1