from django.contrib import admin
from .models import (
    Project, 
    ZarorratService, 
    ZarorratProject, 
    ZarorratProjectService,
    UniqueSolarProduct,
    UniqueSolarProject,
    UniqueSolarProjectProduct,
    UniqueSolarProjectImage,
    UniqueSolarProjectChecklist
)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['project_id', 'customer_name', 'company_id', 'project_type_category', 'status', 'total_amount', 'created_at']
    list_filter = ['project_type_category', 'status', 'company_id', 'created_at']
    search_fields = ['project_id', 'customer_name', 'contact_number']
    readonly_fields = ['project_id', 'created_at', 'updated_at']
    ordering = ['-created_at']

@admin.register(ZarorratService)
class ZarorratServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']
    ordering = ['name']

@admin.register(ZarorratProject)
class ZarorratProjectAdmin(admin.ModelAdmin):
    list_display = ['project_id', 'customer_name', 'date', 'valid_until', 'amount', 'status', 'created_at']
    list_filter = ['status', 'date', 'created_at']
    search_fields = ['project_id', 'customer_name', 'address']
    readonly_fields = ['project_id', 'created_at', 'updated_at']
    ordering = ['-created_at']

@admin.register(ZarorratProjectService)
class ZarorratProjectServiceAdmin(admin.ModelAdmin):
    list_display = ['project', 'service', 'created_at']
    list_filter = ['created_at']
    search_fields = ['project__project_id', 'project__customer_name', 'service__name']
    ordering = ['-created_at']

@admin.register(UniqueSolarProduct)
class UniqueSolarProductAdmin(admin.ModelAdmin):
    list_display = [ 'product_type', 'unit_price',  'is_active', 'created_at']
    list_filter = ['product_type', 'is_active', 'created_at']
    search_fields = ['product_type', 'quantity', 'unit_price', 'line_total']
    ordering = ['product_type', 'quantity', 'unit_price', 'line_total']

@admin.register(UniqueSolarProject)
class UniqueSolarProjectAdmin(admin.ModelAdmin):
    list_display = ['project_id', 'customer_name', 'project_type', 'installation_type', 'grand_total', 'status', 'created_at']
    list_filter = ['status', 'installation_type', 'date', 'created_at']
    search_fields = ['project_id', 'customer_name', 'address', 'project_type']
    readonly_fields = ['project_id', 'subtotal', 'grand_total', 'total_payment', 'completion_payment', 'created_at', 'updated_at']
    ordering = ['-created_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('project_id', 'customer_name', 'address', 'date', 'valid_until', 'project_type')
        }),
        ('Installation & Financial', {
            'fields': ('installation_type', 'subtotal', 'tax_percentage', 'grand_total')
        }),
        ('Payment Terms', {
            'fields': ('advance_payment', 'total_payment', 'completion_payment')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(UniqueSolarProjectProduct)
class UniqueSolarProjectProductAdmin(admin.ModelAdmin):
    list_display = ['project', 'product_type', 'specify_product', 'quantity', 'unit_price', 'line_total', 'order']
    list_filter = ['product_type', 'created_at']
    search_fields = ['project__project_id', 'project__customer_name', 'specify_product']
    readonly_fields = ['line_total', 'created_at']
    ordering = ['project', 'order']

@admin.register(UniqueSolarProjectImage)
class UniqueSolarProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'caption', 'order', 'created_at']
    list_filter = ['created_at']
    search_fields = ['project__project_id', 'project__customer_name', 'caption']
    readonly_fields = ['created_at']
    ordering = ['project', 'order']

@admin.register(UniqueSolarProjectChecklist)
class UniqueSolarProjectChecklistAdmin(admin.ModelAdmin):
    list_display = ['item_name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = [ 'item_name']
    readonly_fields = ['created_at']
    ordering = ['id']
