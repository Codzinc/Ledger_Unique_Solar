from django.urls import path
from . import views

app_name = 'salary'

urlpatterns = [
    path('', views.SalaryView.as_view(), name='salary-list'),
    path('<int:salary_id>/', views.SalaryView.as_view(), name='salary-detail'),
] 