from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum, Q, F
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Product.models import Product
from Project.models import ZarorratProject, UniqueSolarProject
from Expense.models import Expense
from Salary.models import Salary
from .serializers import (
    DashboardDataSerializer, 
    DashboardSummaryResponseSerializer,
    MonthlyProfitSerializer,
    DashboardSummarySerializer,
    DashboardStatsSerializer
)

# Create your views here.

class DashboardDataView(APIView):
    """
    API endpoint to provide dashboard data for graphs
    Returns monthly profit data for "All Time Payments" graph
    with year filter and status filter
    """
    
    def get(self, request):
        try:
            year = request.query_params.get('year', timezone.now().year)
            try:
                year = int(year)
            except ValueError:
                year = timezone.now().year
            
            monthly_data = {}
            
            for month in range(1, 13):
                month_name = datetime(year, month, 1).strftime('%b')
                monthly_data[month_name] = {
                    'month': month_name,
                    'product_profit': 0,
                    'project_profit': 0,
                    'total_profit': 0
                }
            
            products = Product.objects.filter(
                date__year=year
            ).values('date__month').annotate(
                total_profit=Sum(
                    (F('sale_price') - F('purchase_price')) * F('quantity')
                )
            )
            print("products profit",products)
            
            for product in products:
                month_name = datetime(year, product['date__month'], 1).strftime('%b')
                if month_name in monthly_data:
                    monthly_data[month_name]['product_profit'] = float(product['total_profit'] or 0)
            
            zarorrat_projects = ZarorratProject.objects.filter(
                date__year=year,
                status__in=['complete', 'in_progress']
            ).values('date__month').annotate(
                total_amount=Sum('amount')
            )
            

            for project in zarorrat_projects:
                month_name = datetime(year, project['date__month'], 1).strftime('%b')
                if month_name in monthly_data:
                    monthly_data[month_name]['project_profit'] += float(project['total_amount'] or 0)
            
            print("zarorrat projects",zarorrat_projects)
            unique_solar_projects = UniqueSolarProject.objects.filter(
                date__year=year,
                status__in=['complete', 'in_progress']
            ).values('date__month').annotate(
                total_amount=Sum('grand_total')
            )
            print("unique solar projects",unique_solar_projects)
            for project in unique_solar_projects:
                month_name = datetime(year, project['date__month'], 1).strftime('%b')
                if month_name in monthly_data:
                    monthly_data[month_name]['project_profit'] += float(project['total_amount'] or 0)
            
            for month_data in monthly_data.values():
                month_data['total_profit'] = month_data['product_profit'] + month_data['project_profit']
            
            chart_data = list(monthly_data.values())
            
            total_product_profit = sum(item['product_profit'] for item in chart_data)
            total_project_profit = sum(item['project_profit'] for item in chart_data)
            total_profit = sum(item['total_profit'] for item in chart_data)
            
            current_month = timezone.now().strftime('%b')
            current_month_data = monthly_data.get(current_month, {})
            
            response_data = {
                'success': True,
                'chart_data': chart_data,
                'summary': {
                    'total_product_profit': round(total_product_profit, 2),
                    'total_project_profit': round(total_project_profit, 2),
                    'total_profit': round(total_profit, 2),
                    'current_month_profit': round(current_month_data.get('total_profit', 0), 2),
                    'current_month': current_month
                },
                'current_month': current_month
            }
            
            serializer = DashboardDataSerializer(data=response_data)
            if serializer.is_valid():
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': 'Data validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardSummaryView(APIView):
    """
    API endpoint to provide dashboard summary statistics like total projects, total products, total expenses, total salaries, pending projects
    """
    
    def get(self, request):
        try:
            year = request.query_params.get('year', timezone.now().year)
            try:
                year = int(year)
            except ValueError:
                year = timezone.now().year
            
            total_zarorrat_projects = ZarorratProject.objects.filter(date__year=year).count()
            total_unique_solar_projects = UniqueSolarProject.objects.filter(date__year=year).count()
            total_projects = total_zarorrat_projects + total_unique_solar_projects
            
            total_products = Product.objects.filter(date__year=year).count()
            
            total_expenses = Expense.objects.filter(
                date__year=year
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            total_salaries = Salary.objects.filter(
                date__year=year
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            pending_projects = ZarorratProject.objects.filter(
                status='pending',
                date__year=year
            ).count() + UniqueSolarProject.objects.filter(
                status='pending',
                date__year=year
            ).count()
            
            response_data = {
                'success': True,
                'summary': {
                    'total_projects': total_projects,
                    'total_products': total_products,
                    'total_expenses': float(total_expenses),
                    'total_salaries': float(total_salaries),
                    'pending_projects': pending_projects,
                    'year': year
                }
            }
            
            serializer = DashboardSummaryResponseSerializer(data=response_data)
            if serializer.is_valid():
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': 'Data validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DailyProfitView(APIView):
    """
    Simple API endpoint to get daily profit for a specific month
    """
    
    def get(self, request):
        try:
            year = int(request.query_params.get('year', timezone.now().year))
            month = int(request.query_params.get('month', timezone.now().month))
            
            daily_data = []
            
            products = Product.objects.filter(
                date__year=year,
                date__month=month
            ).values('date__day').annotate(
                profit=Sum((F('sale_price') - F('purchase_price')) * F('quantity'))
            )
            
            zarorrat = ZarorratProject.objects.filter(
                date__year=year,
                date__month=month
            ).values('date__day').annotate(
                amount=Sum('amount')
            )
            
            unique_solar = UniqueSolarProject.objects.filter(
                date__year=year,
                date__month=month
            ).values('date__day').annotate(
                amount=Sum('grand_total')
            )
            
            daily_profits = {}
            
            for p in products:
                day = p['date__day']
                daily_profits[day] = daily_profits.get(day, 0) + float(p['profit'] or 0)
            
            for p in zarorrat:
                day = p['date__day']
                daily_profits[day] = daily_profits.get(day, 0) + float(p['amount'] or 0)
                
            for p in unique_solar:
                day = p['date__day']
                daily_profits[day] = daily_profits.get(day, 0) + float(p['amount'] or 0)
            
            for day in range(1, 32): 
                daily_data.append({
                    'day': day,
                    'profit': round(daily_profits.get(day, 0), 2)
                })
            
            return Response({
                'success': True,
                'year': year,
                'month': month,
                'data': daily_data
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FinancialSummaryView(APIView):
    """
    Simple API endpoint to get financial summary for a specific month/year
    """
    
    def get(self, request):
        try:
            year = int(request.query_params.get('year', timezone.now().year))
            month = int(request.query_params.get('month', timezone.now().month))
            
            # Get products with error handling
            try:
                products = Product.objects.filter(
                    date__year=year,
                    date__month=month
                )
                total_sales = sum(float(p.total_sale_value) for p in products)
                total_cost = sum(float(p.total_purchase_cost) for p in products)
                product_profit = total_sales - total_cost
            except Exception as e:
                print(f"Product query error: {e}")
                total_sales = 0
                total_cost = 0
                product_profit = 0
            
            # Get projects with error handling
            try:
                zarorrat = ZarorratProject.objects.filter(
                    date__year=year,
                    date__month=month
                )
                unique_solar = UniqueSolarProject.objects.filter(
                    date__year=year,
                    date__month=month
                )
                project_amount = sum(float(p.amount) for p in zarorrat) + sum(float(p.grand_total) for p in unique_solar)
            except Exception as e:
                print(f"Project query error: {e}")
                project_amount = 0
            
            # Get expenses with error handling
            try:
                expenses = Expense.objects.filter(
                    date__year=year,
                    date__month=month
                )
                total_expenses = sum(float(e.amount) for e in expenses)
            except Exception as e:
                # Handle case where Expense model fields might not match database
                print(f"Expense query error: {e}")
                total_expenses = 0
            
            total_revenue = total_sales + project_amount
            total_profit = product_profit + project_amount - total_expenses
            
            return Response({
                'success': True,
                'year': year,
                'month': month,
                'data': {
                    'total_sales': round(total_sales, 2),
                    'product_profit': round(product_profit, 2),
                    'project_amount': round(project_amount, 2),
                    'total_revenue': round(total_revenue, 2),
                    'total_expenses': round(total_expenses, 2),
                    'total_profit': round(total_profit, 2)
                }
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




