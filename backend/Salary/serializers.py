from rest_framework import serializers
from .models import Salary, AdvanceHistory

class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = '__all__'

class DailyWageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = ['employee', 'date', 'description', 'wage_type']
    
    def create(self, validated_data):
        validated_data['wage_type'] = 'Daily'
        validated_data['amount'] = 0  
        validated_data['total_paid'] = 0
        validated_data['month'] = validated_data['date']
        validated_data['salary_amount'] = 0
        return super().create(validated_data)

class MonthlySalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = ['employee', 'date', 'description', 'salary_amount', 'wage_type']
    
    def create(self, validated_data):
        validated_data['wage_type'] = 'Monthly_wage'
        validated_data['amount'] = validated_data['salary_amount']
        validated_data['total_paid'] = validated_data['salary_amount']
        validated_data['month'] = validated_data['date']
        return super().create(validated_data)

class AdvanceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvanceHistory
        fields = ['id', 'employee', 'date', 'advance_taken', 'purpose', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class MonthlySalaryWithAdvanceSerializer(serializers.ModelSerializer):
    """Serializer for monthly salary with advance calculations"""
    total_advance_taken = serializers.SerializerMethodField()
    remaining_salary = serializers.SerializerMethodField()
    advance_history = serializers.SerializerMethodField()
    
    class Meta:
        model = Salary
        fields = [
            'id', 'employee', 'month', 'amount', 'salary_amount', 
            'wage_type', 'status', 'total_advance_taken', 
            'remaining_salary', 'advance_history'
        ]
    
    def get_total_advance_taken(self, obj):
        """Calculate total advance taken for the employee in the given month"""
        if obj.wage_type == 'Monthly_wage':
            # Get advances for the employee in the same month
            advances = AdvanceHistory.objects.filter(
                employee=obj.employee,
                date__year=obj.month.year,
                date__month=obj.month.month
            )
            return sum(advance.advance_taken for advance in advances)
        return 0
    
    def get_remaining_salary(self, obj):
        """Calculate remaining salary after deducting advances"""
        if obj.wage_type == 'Monthly_wage':
            total_advance = self.get_total_advance_taken(obj)
            base_salary = float(obj.amount)
            return base_salary - total_advance
        return 0
    
    def get_advance_history(self, obj):
        """Get advance history for the employee in the given month"""
        if obj.wage_type == 'Monthly_wage':
            advances = AdvanceHistory.objects.filter(
                employee=obj.employee,
                date__year=obj.month.year,
                date__month=obj.month.month
            ).order_by('-date')
            return AdvanceHistorySerializer(advances, many=True).data
        return []
