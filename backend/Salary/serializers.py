from rest_framework import serializers
from .models import Salary

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
