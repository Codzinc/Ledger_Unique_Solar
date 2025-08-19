from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    # Dashboard API endpoints
    path('data/', views.DashboardDataView.as_view(), name='dashboard_data'),
    path('summary/', views.DashboardSummaryView.as_view(), name='dashboard_summary'),
    path('daily/', views.DailyProfitView.as_view(), name='daily_profit'),
    path('financial/', views.FinancialSummaryView.as_view(), name='financial_summary'),
    path('zarorrat/', views.ZarorratProfitView.as_view(), name='zarorrat_profit'),
] 