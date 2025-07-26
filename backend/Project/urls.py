from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'project'

# Create router and register viewsets
router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'zarorrat-services', views.ZarorratServiceViewSet)
router.register(r'zarorrat-projects', views.ZarorratProjectViewSet)
router.register(r'unique-solar-products', views.UniqueSolarProductViewSet)
router.register(r'unique-solar-projects', views.UniqueSolarProjectViewSet)
router.register(r'unique-solar-project-products', views.UniqueSolarProjectProductViewSet)
router.register(r'unique-solar-project-images', views.UniqueSolarProjectImageViewSet)
router.register(r'unique-solar-project-checklist', views.UniqueSolarProjectChecklistViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
] 