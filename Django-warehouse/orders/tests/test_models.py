
def test_salesorder_model(salesorder):
    assert salesorder.customer_name == 'Rakesh'


def test_salesorderitem_model(salesorderitem):
    assert salesorderitem.product.category.name == 'fruits'
    assert salesorderitem.quantity == 2