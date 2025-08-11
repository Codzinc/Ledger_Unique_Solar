from django.urls import path
from . import views

app_name = 'salary'

urlpatterns = [
    path('', views.SalaryView.as_view(), name='salary-list'),
    path('<int:salary_id>/', views.SalaryView.as_view(), name='salary-detail'),
    path('daily-wage/', views.DailyWageView.as_view(), name='daily-wage'),
    path('monthly-salary/', views.MonthlySalaryView.as_view(), name='monthly-salary'),
] 