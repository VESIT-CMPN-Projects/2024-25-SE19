from django.db import models
from django.utils.translation import gettext_lazy as _

class Patient(models.Model):
    """
    Patient information model
    """
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('NEW', 'New Patient'),
        ('ONGOING', 'Ongoing Treatment'),
        ('COMPLETED', 'Treatment Completed'),
        ('FOLLOW_UP', 'Follow-up Required'),
    )
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField(default=0)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    contact_number = models.CharField(max_length=17)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    existing_conditions = models.TextField(blank=True, verbose_name='Existing Medical Conditions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    last_visit = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    class Meta:
        ordering = ['-created_at']

class MedicalHistory(models.Model):
    """
    Patient's medical history records
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_histories')
    condition = models.CharField(max_length=200)
    diagnosis_date = models.DateField()
    treatment = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Medical histories"
        ordering = ['-diagnosis_date']

class Medication(models.Model):
    """
    Patient's current and past medications
    """
    MEDICATION_STATUS = (
        ('CURRENT', 'Current'),
        ('PAST', 'Past'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=MEDICATION_STATUS)
    prescribed_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-prescribed_date']

class Document(models.Model):
    """
    Model to store patient documents (reports, x-rays, etc.)
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='patient_documents/')
    document_type = models.CharField(max_length=50)  # X-ray, Report, etc.
    upload_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return self.title
    
# Patient/models.py - Add this model
class ToothStatus(models.Model):
    patient = models.ForeignKey('Patient', related_name='teeth_status', on_delete=models.CASCADE)
    tooth_number = models.IntegerField()
    status = models.CharField(max_length=20, default='normal')
    notes = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['patient', 'tooth_number']
        ordering = ['tooth_number']
    
    def __str__(self):
        return f"Tooth {self.tooth_number} - {self.status} ({self.patient})"