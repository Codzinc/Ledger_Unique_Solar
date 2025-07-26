from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from decimal import Decimal

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    customer_name = models.CharField(max_length=200)
    date = models.DateField(help_text="Date of purchase or transaction", default=timezone.now)
    purchase_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Purchase price per unit"
    )
    sale_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Sale price per unit"
    )
    category = models.CharField(max_length=100, help_text="Product category")
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Optional product description"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.brand} - {self.customer_name}"

    @property
    def total_purchase_cost(self):
        """Calculate total purchase cost"""
        if self.purchase_price is not None and self.quantity is not None:
            return self.purchase_price * self.quantity
        return 0

    @property
    def total_sale_value(self):
        """Calculate total sale value"""
        if self.sale_price is not None and self.quantity is not None:
            return self.sale_price * self.quantity
        return 0

    @property
    def profit_per_unit(self):
        """Calculate profit per unit"""
        if self.sale_price is not None and self.purchase_price is not None:
            return self.sale_price - self.purchase_price
        return 0

    @property
    def total_profit(self):
        """Calculate total profit"""
        if self.profit_per_unit is not None and self.quantity is not None:
            return self.profit_per_unit * self.quantity
        return 0

    @property
    def profit_margin_percentage(self):
        """Calculate profit margin as percentage"""
        if self.purchase_price is not None and self.purchase_price > 0 and self.profit_per_unit is not None:
            return (self.profit_per_unit / self.purchase_price) * 100
        return 0

    class Meta:
        ordering = ['-created_at']

class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(
        upload_to='products/',
        help_text="Product image"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of the image (1-7)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.brand} - Image {self.order}"

    def save(self, *args, **kwargs):
        # Check if this product already has 7 images
        if not self.pk:  # Only check on creation
            existing_count = ProductImage.objects.filter(product=self.product).count()
            if existing_count >= 7:
                raise ValueError("Maximum 7 images allowed per product")
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['order']
        unique_together = ['product', 'order']
