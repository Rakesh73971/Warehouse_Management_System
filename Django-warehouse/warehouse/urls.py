from rest_framework.routers import DefaultRouter
from .views import WarehouseViewSet,ZoneViewSet,RackViewSet,BinViewSet,StorageTypeViewSet

router = DefaultRouter()

router.register('warehouses',WarehouseViewSet,basename='warehouse')
router.register('zones',ZoneViewSet,basename='zone')
router.register('racks',RackViewSet,basename='rack')
router.register('bins',BinViewSet,basename='bin')
router.register('storagetypes',StorageTypeViewSet,basename='storagetype')

urlpatterns = router.urls