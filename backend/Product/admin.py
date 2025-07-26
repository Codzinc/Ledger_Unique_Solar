from django.contrib import admin
from .models import Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'order']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'customer_name', 'date', 'category', 'quantity', 'total_profit', 'created_at']
    list_filter = ['category', 'brand', 'date', 'created_at']
    search_fields = ['name', 'brand', 'customer_name', 'category']
    readonly_fields = ['total_purchase_cost', 'total_sale_value', 'profit_per_unit', 'total_profit', 'profit_margin_percentage', 'created_at', 'updated_at']
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'brand', 'customer_name', 'date', 'category')
        }),
        ('Pricing', {
            'fields': ('purchase_price', 'sale_price', 'quantity')
        }),
        ('Additional Information', {
            'fields': ('description',)
        }),
        ('Calculated Fields', {
            'fields': ('total_purchase_cost', 'total_sale_value', 'profit_per_unit', 'total_profit', 'profit_margin_percentage'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'order', 'image', 'created_at']
    list_filter = ['product', 'created_at']
    search_fields = ['product__name', 'product__brand']
    ordering = ['product', 'order']



