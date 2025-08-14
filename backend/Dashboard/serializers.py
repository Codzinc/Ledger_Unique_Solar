from rest_framework import serializers

class MonthlyProfitSerializer(serializers.Serializer):
    """Serializer for monthly profit data"""
    month = serializers.CharField()
    product_profit = serializers.FloatField()
    project_profit = serializers.FloatField()
    total_profit = serializers.FloatField()

class DashboardSummarySerializer(serializers.Serializer):
    """Serializer for dashboard summary statistics"""
    total_product_profit = serializers.FloatField()
    total_project_profit = serializers.FloatField()
    total_profit = serializers.FloatField()
    current_month_profit = serializers.FloatField()
    current_month = serializers.CharField()

class DashboardDataSerializer(serializers.Serializer):
    """Serializer for complete dashboard data response"""
    success = serializers.BooleanField()
    chart_data = MonthlyProfitSerializer(many=True)
    summary = DashboardSummarySerializer()
    current_month = serializers.CharField()

class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_projects = serializers.IntegerField()
    total_products = serializers.IntegerField()
    total_expenses = serializers.FloatField()
    total_salaries = serializers.FloatField()
    pending_projects = serializers.IntegerField()
    year = serializers.IntegerField()

class DashboardSummaryResponseSerializer(serializers.Serializer):
    """Serializer for dashboard summary response"""
    success = serializers.BooleanField()
    summary = DashboardStatsSerializer()
