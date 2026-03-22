from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet,ProductViewSet,InventoryViewSet,StockMovementViewSet

router = DefaultRouter()
router.register('categories',CategoryViewSet,basename='categories')
router.register('products',ProductViewSet,basename='products')
router.register('inventories',InventoryViewSet,basename='inventories')
router.register('stockmovements',StockMovementViewSet,basename='stockmovements')

urlpatterns = router.urls
