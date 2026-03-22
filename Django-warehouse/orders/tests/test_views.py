
from orders.models import SalesOrder,SalesOrderItem

    # -----------------
    # SALESORDER TEST
    # -----------------

def test_create_salesorder(auth_client):
    response = auth_client.post(
        '/api/order/salesorders/',
        {
            'order_number':'AZ001',
            'customer_name':'rakesh',
            'status':'COMPLETED'
        },
        format='json'
    )

    assert response.status_code == 201
    assert SalesOrder.objects.count() == 1

def test_filter_order_number(auth_client):
    SalesOrder.objects.create(order_number='AB123',customer_name='Rakesh',status='COMPLETED')
    SalesOrder.objects.create(order_number='AB124',customer_name='Gukesh',status='PENDING')

    response = auth_client.get('/api/order/salesorders/?order_number=AB123')

    assert response.status_code == 200
    assert len(response.data) == 1


# ---------------------
# SALESORDERITEM TEST
# ---------------------
def test_create_salesorderitem(auth_client,salesorder,product):
    response = auth_client.post(
        '/api/order/salesorderitems/',
        {
            'order':salesorder.id,
            'product':product.id,
            'quantity':10
        },
        format='json'
    )

    assert response.status_code == 201
    assert SalesOrderItem.objects.count() == 1

