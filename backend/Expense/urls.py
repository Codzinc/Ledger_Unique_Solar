from django.urls import path
from . import views

app_name = 'expense'

urlpatterns = [
    path('', views.ExpenseView.as_view(), name='expense-list'),
    path('<int:expense_id>/', views.ExpenseView.as_view(), name='expense-detail'),
] 