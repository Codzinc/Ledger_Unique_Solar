from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from .models import Salary, AdvanceHistory
from .serializers import (
    SalarySerializer, DailyWageSerializer, MonthlySalarySerializer,
    AdvanceHistorySerializer, MonthlySalaryWithAdvanceSerializer
)

class SalaryPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class SalaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, salary_id=None):
        if salary_id:
            salary = get_object_or_404(Salary, id=salary_id)
            serializer = SalarySerializer(salary)
            return Response(serializer.data)    
        else:
            salaries = Salary.objects.all()
            if not salaries.exists():
                return Response({'error': 'No salaries found'}, status=status.HTTP_204_NO_CONTENT)
            
            paginator = SalaryPagination()
            paginated_salaries = paginator.paginate_queryset(salaries, request) 
            serializer = SalarySerializer(paginated_salaries, many=True)
            return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = SalarySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            salary = serializer.save(updated_by=request.user)
            return Response(SalarySerializer(salary).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, salary_id):
        salary = get_object_or_404(Salary, id=salary_id)
        serializer = SalarySerializer(salary, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            salary = serializer.save(updated_by=request.user)
            return Response(SalarySerializer(salary).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, salary_id):
        salary = get_object_or_404(Salary, id=salary_id)
        salary.delete()
        return Response({'message': 'Salary deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class DailyWageView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all daily wages"""
        daily_wages = Salary.objects.filter(wage_type='Daily')
        if not daily_wages.exists():
            return Response({'error': 'No daily wages found'}, status=status.HTTP_204_NO_CONTENT)
        
        paginator = SalaryPagination()
        paginated_wages = paginator.paginate_queryset(daily_wages, request)
        serializer = DailyWageSerializer(paginated_wages, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        """Create a new daily wage entry"""
        serializer = DailyWageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            salary = serializer.save(updated_by=request.user)
            return Response({
                'message': 'Daily wage created successfully',
                'data': DailyWageSerializer(salary).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MonthlySalaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all monthly salaries"""
        monthly_salaries = Salary.objects.filter(wage_type='Monthly_wage')
        if not monthly_salaries.exists():
            return Response({'error': 'No monthly salaries found'}, status=status.HTTP_204_NO_CONTENT)
        
        paginator = SalaryPagination()
        paginated_salaries = paginator.paginate_queryset(monthly_salaries, request)
        serializer = MonthlySalaryWithAdvanceSerializer(paginated_salaries, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        """Create a new monthly salary entry"""
        serializer = MonthlySalarySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            salary = serializer.save(updated_by=request.user)
            return Response({
                'message': 'Monthly salary created successfully',
                'data': MonthlySalaryWithAdvanceSerializer(salary).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdvanceHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, advance_id=None):
        """Get advance history - all or specific by ID"""
        if advance_id:
            advance = get_object_or_404(AdvanceHistory, id=advance_id)
            serializer = AdvanceHistorySerializer(advance)
            return Response(serializer.data)
        else:
            employee = request.query_params.get('employee', None)
            month = request.query_params.get('month', None)
            year = request.query_params.get('year', None)
            
            advances = AdvanceHistory.objects.all()
            
            if employee:
                advances = advances.filter(employee=employee)
            if month and year:
                advances = advances.filter(date__year=year, date__month=month)
            
            if not advances.exists():
                return Response({'error': 'No advances found'}, status=status.HTTP_204_NO_CONTENT)
            
            paginator = SalaryPagination()
            paginated_advances = paginator.paginate_queryset(advances, request)
            serializer = AdvanceHistorySerializer(paginated_advances, many=True)
            return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        """Create a new advance entry"""
        serializer = AdvanceHistorySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            advance = serializer.save(updated_by=request.user)
            return Response({
                'message': 'Advance created successfully',
                'data': AdvanceHistorySerializer(advance).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, advance_id):
        """Update an existing advance entry"""
        advance = get_object_or_404(AdvanceHistory, id=advance_id)
        serializer = AdvanceHistorySerializer(advance, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            advance = serializer.save(updated_by=request.user)
            return Response({
                'message': 'Advance updated successfully',
                'data': AdvanceHistorySerializer(advance).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, advance_id):
        """Delete an advance entry"""
        advance = get_object_or_404(AdvanceHistory, id=advance_id)
        advance.delete()
        return Response({'message': 'Advance deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class EmployeeSalarySummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, employee_name):
        """Get comprehensive salary summary for a specific employee including advances"""
        month = request.query_params.get('month', None)
        year = request.query_params.get('year', None)
        
        salary_filter = {'employee': employee_name, 'wage_type': 'Monthly_wage'}
        if month and year:
            salary_filter['month__year'] = year
            salary_filter['month__month'] = month
        
        try:
            salary = Salary.objects.get(**salary_filter)
        except Salary.DoesNotExist:
            return Response({'error': 'Monthly salary not found for this employee'}, status=status.HTTP_404_NOT_FOUND)
        
        advance_filter = {'employee': employee_name}
        if month and year:
            advance_filter['date__year'] = year
            advance_filter['date__month'] = month
        
        advances = AdvanceHistory.objects.filter(**advance_filter).order_by('-date')
        total_advance = advances.aggregate(total=Sum('advance_taken'))['total'] or 0
        
        base_salary = float(salary.amount)
        remaining_salary = base_salary - total_advance
        
        response_data = {
            'employee': employee_name,
            'month': salary.month,
            'base_salary': base_salary,
            'total_advance_taken': total_advance,
            'remaining_salary': remaining_salary,
            'advance_history': AdvanceHistorySerializer(advances, many=True).data
        }
        
        return Response(response_data)


