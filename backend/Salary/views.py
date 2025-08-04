from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Salary
from .serializers import SalarySerializer

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

