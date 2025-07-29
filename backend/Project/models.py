from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid
from django.core.exceptions import ValidationError

# Create your models here.

class ZarorratService(models.Model):
    """Model for Zarorrat services that will be managed from backend"""
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class ZarorratProject(models.Model):
    """Model for Zarorrat.com projects"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('complete', 'Complete'),
        ('cancelled', 'Cancelled'),
    ]
    
    project_id = models.CharField(max_length=20, unique=True, blank=True)
    customer_name = models.CharField(max_length=200)
    address = models.TextField()
    date = models.DateField(default=timezone.now)
    valid_until = models.DateField()
    notes = models.TextField(blank=True, null=True)
    amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        default=0
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.project_id} - {self.customer_name}"
    
    def generate_project_id(self):
        """Generate project ID for Zarorrat projects"""
        current_year = timezone.now().year
        
        # Get the next unique ID for Zarorrat projects this year
        last_project = ZarorratProject.objects.filter(
            project_id__startswith=f'ZR-{current_year}-'
        ).order_by('-project_id').first()
        
        if last_project:
            try:
                last_number = int(last_project.project_id.split('-')[-1])
                next_number = last_number + 1
            except (ValueError, IndexError):
                next_number = 1
        else:
            next_number = 1
            
        return f"ZR-{current_year}-{next_number:04d}"
    
    def save(self, *args, **kwargs):
        if not self.project_id:
            self.project_id = self.generate_project_id()
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Zarorrat Project"
        verbose_name_plural = "Zarorrat Projects"

class ZarorratProjectService(models.Model):
    """Many-to-many relationship between ZarorratProject and ZarorratService"""
    project = models.ForeignKey(
        ZarorratProject, 
        on_delete=models.CASCADE,
        related_name='selected_services'
    )
    service = models.ForeignKey(
        ZarorratService, 
        on_delete=models.CASCADE,
        related_name='projects'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['project', 'service']





class UniqueSolarProject(models.Model):
    """Model for Unique Solar projects"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('complete', 'Complete'),
        ('cancelled', 'Cancelled'),
    ]
    
    INSTALLATION_TYPE_CHOICES = [
        ('no_installation', 'No Installation'),
        ('standard', 'Standard Installation'),
        ('elevated', 'Elevated Installation'),
    ]
    PROJECT_TYPE_CHOICES = [
        ('on_grid', 'On Grid'),
        ('off_grid', 'Off Grid'),
        ('hybrid', 'Hybrid'),
    ]
    
    project_id = models.CharField(max_length=20, unique=True, blank=True)
    customer_name = models.CharField(max_length=200)
    address = models.TextField()
    date = models.DateField(default=timezone.now)
    valid_until = models.DateField()
    project_type = models.CharField(max_length=100, choices=PROJECT_TYPE_CHOICES, default='on_grid')
    installation_type = models.CharField(
        max_length=20, 
        choices=INSTALLATION_TYPE_CHOICES,
        default='no_installation'
    )
    subtotal = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=0
    )
    tax_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=0
    )
    grand_total = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=0
    )
    advance_payment = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=0
    )
    total_payment = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=0
    )
    completion_payment = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=0
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.project_id} - {self.customer_name}"
    
    def generate_project_id(self):
        """Generate project ID for Unique Solar projects"""
        current_year = timezone.now().year
        
        # Get the next unique ID for Unique Solar projects this year
        last_project = UniqueSolarProject.objects.filter(
            project_id__startswith=f'US-{current_year}-'
        ).order_by('-project_id').first()
        
        if last_project:
            try:
                last_number = int(last_project.project_id.split('-')[-1])
                next_number = last_number + 1
            except (ValueError, IndexError):
                next_number = 1
        else:
            next_number = 1
            
        return f"US-{current_year}-{next_number:04d}"
    
    def calculate_totals(self):
        """Calculate subtotal, tax, and grand total"""
        if self.pk:
            self.subtotal = sum(item.line_total for item in self.products.all())
        else:
            self.subtotal = Decimal('0.00')
        
        tax_amount = (self.subtotal * self.tax_percentage) / 100
        
        self.grand_total = self.subtotal + tax_amount
        
        self.total_payment = self.grand_total
        self.completion_payment = self.total_payment - self.advance_payment
    
    def save(self, *args, **kwargs):
        if not self.project_id:
            self.project_id = self.generate_project_id()
        
        super().save(*args, **kwargs)
        
        self.calculate_totals()
        
        super().save(update_fields=['subtotal', 'grand_total', 'total_payment', 'completion_payment'])
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Unique Solar Project"
        verbose_name_plural = "Unique Solar Projects"

class UniqueSolarProjectProduct(models.Model):

    PRODUCT_TYPE_CHOICES = [
        ('solar_panel', 'Solar Panel'),
        ('inverter', 'Inverter'),

        ('others', 'Others'),
    ]
    """Products associated with Unique Solar projects"""
    project = models.ForeignKey(
        UniqueSolarProject, 
        on_delete=models.CASCADE,
        related_name='products'
    )
    product_type = models.CharField(max_length=50, choices=PRODUCT_TYPE_CHOICES)
    specify_product = models.CharField(max_length=200, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    unit_price = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=0
    )
    line_total = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=0
    )
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.project.project_id} - {self.specify_product}"
    
    def save(self, *args, **kwargs):
        # Calculate line total
        self.line_total = self.quantity * self.unit_price
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['order']
        unique_together = ['project', 'order']

class UniqueSolarProjectImage(models.Model):
    """Images associated with Unique Solar projects"""
    project = models.ForeignKey(
        UniqueSolarProject, 
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(
        upload_to='unique_solar_projects/',
        help_text="Project image or receipt"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of the image (0-6, max 7 images per project)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.project.project_id} - Image {self.order}"
    
    def save(self, *args, **kwargs):
        if not self.pk:
            existing_count = UniqueSolarProjectImage.objects.filter(project=self.project).count()
            if existing_count >= 7:
                raise ValidationError("Maximum of 7 images allowed per project")
            
            self.order = existing_count
        
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['order']
        unique_together = ['project', 'order']
        

class UniqueSolarChecklist(models.Model):
    """Checklist items for Unique Solar projects"""
   
    item_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.item_name}"
    
    class Meta:
        ordering = ['id']
        
class UniqueSolarProjectChecklist(models.Model):
    """Checklist items for Unique Solar projects"""
    project = models.ForeignKey(
        UniqueSolarProject, 
        on_delete=models.CASCADE,
        related_name='checklist'
    )
    checklist = models.ForeignKey(
        UniqueSolarChecklist,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"{self.project.project_id} - {self.checklist.item_name}"

    class Meta:
        unique_together = ['project', 'checklist']