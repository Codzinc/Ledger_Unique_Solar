from django.urls import path
from . import views

app_name = 'salary'

urlpatterns = [
    path('', views.SalaryView.as_view(), name='salary-list'),
    path('<int:salary_id>/', views.SalaryView.as_view(), name='salary-detail'),
    path('daily-wage/', views.DailyWageView.as_view(), name='daily-wage'),
    path('monthly-salary/', views.MonthlySalaryView.as_view(), name='monthly-salary'),
    
    path('advance/', views.AdvanceHistoryView.as_view(), name='advance-list'),
    path('advance/<int:advance_id>/', views.AdvanceHistoryView.as_view(), name='advance-detail'),
    path('employee/<str:employee_name>/summary/', views.EmployeeSalarySummaryView.as_view(), name='employee-salary-summary'),
] 