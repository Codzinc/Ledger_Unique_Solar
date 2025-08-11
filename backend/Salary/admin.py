from django.contrib import admin
from .models import Salary

# Register your models here.

class SalaryAdmin(admin.ModelAdmin):
    list_display = ('id','employee', 'amount', 'date','updated_by')
    list_filter = ( 'date','wage_type')
    search_fields = ('title', 'description')

admin.site.register(Salary, SalaryAdmin)