from rest_framework.routers import DefaultRouter
from .views import SalesOrderViewSet,SalesOrderItemViewSet


routers = DefaultRouter()
routers.register('salesorders',SalesOrderViewSet,basename='salesorders')
routers.register('salesorderitems',SalesOrderItemViewSet,basename='salesorderitems')

urlpatterns = routers.urls