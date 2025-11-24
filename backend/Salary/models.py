from email.policy import default
from random import choices
from django.db import models
from django.core.exceptions import ValidationError
from Authentication.models import CustomUser

# Create your models here.


class Salary(models.Model):

    WAGE_TYPE = [
        ("Monthly", "Monthly"),
        ("Daily", "Daily"),
        ("Wage", "Wage"),
    ]
    wage_type = models.CharField(max_length=20, choices=WAGE_TYPE, default="Wage")
    employee = models.CharField(max_length=255)
    month = models.DateField()
    total_paid = models.PositiveIntegerField()
    status = models.CharField(max_length=50, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    salary_amount = models.PositiveIntegerField(null=True, blank=True)
    updated_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True
    )
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.employee


class AdvanceHistory(models.Model):
    """Model to track advance payments taken by employees"""

    employee = models.CharField(max_length=255)
    date = models.DateField()
    advance_taken = models.DecimalField(max_digits=10, decimal_places=2)
    purpose = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True
    )

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "Advance Histories"

    def __str__(self):
        return f"{self.employee} - {self.date} - Rs. {self.advance_taken}"
