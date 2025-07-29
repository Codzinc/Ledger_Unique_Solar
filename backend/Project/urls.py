from django.urls import path
from . import views

urlpatterns = [
    # Legacy Project URLs
    path('', views.ProjectListView.as_view(), name='project-list'),
    # path('create/', views.ProjectCreateView.as_view(), name='project-create'),
    path('projects/<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    
    # Zarorrat Service URLs
    path('zarorrat-services/', views.ZarorratServiceListView.as_view(), name='zarorrat-service-list'),

    # Zarorrat Project URLs
    path('zarorrat-projects/', views.ZarorratProjectListView.as_view(), name='zarorrat-project-list'),
    path('zarorrat-projects/create/', views.ZarorratProjectCreateView.as_view(), name='zarorrat-project-create'),
    path('zarorrat-projects/<str:project_id>/', views.ZarorratProjectDetailView.as_view(), name='zarorrat-project-detail'),
    path('zarorrat-projects/<str:project_id>/services/', views.ZarorratProjectServicesView.as_view(), name='zarorrat-project-services'),
    
    # Unique Solar Product URLs
    path('unique-solar-products/', views.UniqueSolarProductListView.as_view(), name='unique-solar-product-list'),
    path('unique-solar-products/create/', views.UniqueSolarProductCreateView.as_view(), name='unique-solar-product-create'),
    path('unique-solar-products/<int:pk>/', views.UniqueSolarProductDetailView.as_view(), name='unique-solar-product-detail'),
    
    # Unique Solar Project URLs
    path('unique-solar-projects/', views.UniqueSolarProjectListView.as_view(), name='unique-solar-project-list'),
    path('unique-solar-projects/create/', views.UniqueSolarProjectCreateView.as_view(), name='unique-solar-project-create'),
    path('unique-solar-projects/<int:pk>/', views.UniqueSolarProjectDetailView.as_view(), name='unique-solar-project-detail'),
    path('unique-solar-projects/<int:pk>/products/', views.UniqueSolarProjectProductsView.as_view(), name='unique-solar-project-products'),
    path('unique-solar-projects/<int:pk>/images/', views.UniqueSolarProjectImagesView.as_view(), name='unique-solar-project-images'),
    path('unique-solar-projects/<int:pk>/checklist/', views.UniqueSolarProjectChecklistView.as_view(), name='unique-solar-project-checklist'),
    
    # Unique Solar Project Product URLs
    path('unique-solar-project-products/', views.UniqueSolarProjectProductListView.as_view(), name='unique-solar-project-product-list'),
    path('unique-solar-project-products/create/', views.UniqueSolarProjectProductCreateView.as_view(), name='unique-solar-project-product-create'),
    path('unique-solar-project-products/<int:pk>/', views.UniqueSolarProjectProductDetailView.as_view(), name='unique-solar-project-product-detail'),
    
    # Unique Solar Project Image URLs
    path('unique-solar-project-images/', views.UniqueSolarProjectImageListView.as_view(), name='unique-solar-project-image-list'),
    path('unique-solar-project-images/create/', views.UniqueSolarProjectImageCreateView.as_view(), name='unique-solar-project-image-create'),
    path('unique-solar-project-images/<int:pk>/', views.UniqueSolarProjectImageDetailView.as_view(), name='unique-solar-project-image-detail'),
    
    # Unique Solar Project Checklist URLs
    path('unique-solar-project-checklist/', views.UniqueSolarProjectChecklistListView.as_view(), name='unique-solar-project-checklist-list'),
    path('unique-solar-project-checklist/create/', views.UniqueSolarProjectChecklistCreateView.as_view(), name='unique-solar-project-checklist-create'),
    path('unique-solar-project-checklist/<int:pk>/', views.UniqueSolarProjectChecklistDetailView.as_view(), name='unique-solar-project-checklist-detail'),
] 