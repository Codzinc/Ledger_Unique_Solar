from django.db import models
from django.core.exceptions import ValidationError
from Authentication.models import CustomUser
# Create your models here.

class Expense(models.Model):
    UTILZER_TYPE =[
        ('Tariq','Tariq'),
        ('Sajid','Sajid'),
        ('Wajid','Wajid'),
    ]
    title = models.CharField(max_length=255)
    utilizer=models.CharField(max_length=255,choices=UTILZER_TYPE)
    category=models.CharField( max_length=255, null=True, blank=True)
    amount=models.DecimalField(max_digits=10,decimal_places=2)
    date=models.DateField()
    image1=models.ImageField(upload_to='expense_images/',blank=True,null=True)
    image2=models.ImageField(upload_to='expense_images/',blank=True,null=True)
    image3=models.ImageField(upload_to='expense_images/',blank=True,null=True)
    image4=models.ImageField(upload_to='expense_images/',blank=True,null=True)
    image5=models.ImageField(upload_to='expense_images/',blank=True,null=True)
    image6=models.ImageField(upload_to='expense_images/',blank=True,null=True)
    image7=models.ImageField(upload_to='expense_images/',blank=True,null=True)
    updated_by=models.ForeignKey(CustomUser,on_delete=models.CASCADE, null=True, blank=True)
    description=models.TextField(blank=True,null=True)

    def __str__(self):
        return self.title
