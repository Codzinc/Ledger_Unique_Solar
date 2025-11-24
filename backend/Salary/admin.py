from django.contrib import admin
from .models import Salary, AdvanceHistory


@admin.register(Salary)
class SalaryAdmin(admin.ModelAdmin):
    list_display = ["employee", "wage_type", "month", "amount", "status", "date"]
    list_filter = ["wage_type", "status", "month", "date"]
    search_fields = ["employee"]
    date_hierarchy = "month"
    ordering = ["-month", "employee"]


@admin.register(AdvanceHistory)
class AdvanceHistoryAdmin(admin.ModelAdmin):
    list_display = ["employee", "date", "advance_taken", "purpose", "created_at"]
    list_filter = ["employee", "date", "created_at"]
    search_fields = ["employee", "purpose"]
    date_hierarchy = "date"
    ordering = ["-date", "employee"]
    readonly_fields = ["created_at", "updated_at"]
