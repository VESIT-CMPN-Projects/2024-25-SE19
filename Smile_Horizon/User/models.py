from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

class User(AbstractUser):
    """
    Extended User model to handle both doctors and staff
    """
    ROLE_CHOICES = (
        ('DOCTOR', 'Doctor'),
        ('STAFF', 'Staff'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    specialization = models.CharField(max_length=100, blank=True)  # For doctors
    
    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name}" if self.role == 'DOCTOR' else f"{self.first_name} {self.last_name}"