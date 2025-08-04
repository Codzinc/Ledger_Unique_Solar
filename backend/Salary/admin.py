from django.contrib import admin
from .models import Salary

# Register your models here.

class SalaryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'amount', 'date','updated_by')
    list_filter = ('category', 'date')
    search_fields = ('title', 'description')

admin.site.register(Salary, SalaryAdmin)