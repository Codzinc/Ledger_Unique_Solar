from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Expense
from .serializers import ExpenseSerializer

class ExpensePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ExpenseView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, expense_id=None):
        if expense_id:
            expense = get_object_or_404(Expense, id=expense_id)
            serializer = ExpenseSerializer(expense)
            return Response(serializer.data)    
        else:
            expenses = Expense.objects.all()
            if not expenses.exists():
                return Response({'error': 'No expenses found'}, status=status.HTTP_204_NO_CONTENT)
            
            paginator = ExpensePagination()
            paginated_expenses = paginator.paginate_queryset(expenses, request) 
            serializer = ExpenseSerializer(paginated_expenses, many=True)
            return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = ExpenseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            expense = serializer.save(updated_by=request.user)
            return Response(ExpenseSerializer(expense).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, expense_id):
        expense = get_object_or_404(Expense, id=expense_id)
        serializer = ExpenseSerializer(expense, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            expense = serializer.save(updated_by=request.user)
            return Response(ExpenseSerializer(expense).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, expense_id):
        expense = get_object_or_404(Expense, id=expense_id)
        expense.delete()
        return Response({'message': 'Expense deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

