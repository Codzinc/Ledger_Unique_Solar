from django.urls import path
from . import views

urlpatterns = [
        # Zarorrat Service URLs
    path('zarorrat-services/', views.ZarorratServiceListView.as_view(), name='zarorrat-service-list'),

    # Zarorrat Project URLs
    path('zarorrat-projects/', views.ZarorratProjectListView.as_view(), name='zarorrat-project-list'),
    path('zarorrat-projects/create/', views.ZarorratProjectCreateView.as_view(), name='zarorrat-project-create'),
    path('zarorrat-projects/<str:project_id>/', views.ZarorratProjectDetailView.as_view(), name='zarorrat-project-detail'),

    # Unique Solar Project URLs
    path('unique-solar-projects/', views.UniqueSolarProjectListView.as_view(), name='unique-solar-project-list'),
    path('unique-solar-projects/create/', views.UniqueSolarProjectCreateView.as_view(), name='unique-solar-project-create'),
    path('unique-solar-projects/<str:project_id>/', views.UniqueSolarProjectDetailView.as_view(), name='unique-solar-project-detail'),



    
    # Unique Solar Project Checklist URLs
    path('unique-solar-checklist/', views.UniqueSolarChecklistListView.as_view(), name='unique-solar-project-checklist-list'),

] 