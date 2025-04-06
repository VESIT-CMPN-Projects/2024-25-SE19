from django.db import models
from Patient.models import Patient
from User.models import User  # Keep this for any future references, but it's no longer necessary for the `doctor` field

class TreatmentType(models.Model):
    # TreatmentType model remains unchanged
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    average_duration = models.DurationField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class Appointment(models.Model):
    """
    Model to handle appointments
    """
    STATUS_CHOICES = (
        ('SCHEDULED', 'Scheduled'),
        ('CONFIRMED', 'Confirmed'),
        ('CHECKED_IN', 'Checked In'),
        ('COMPLETED', 'Completed'),
        ('RESCHEDULED', 'Rescheduled'),
        ('CANCELLED', 'Cancelled'),
        ('NO_SHOW', 'No Show'),
    )
    
    patient = models.ForeignKey('Patient.Patient', on_delete=models.CASCADE)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient} - {self.appointment_date} {self.appointment_time}"
    
    class Meta:
        ordering = ['-appointment_date', 'appointment_time']

class TreatmentRecord(models.Model):
    """
    Records of treatments performed on patients
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='treatment_records')
    appointment = models.OneToOneField(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='treatment_record')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_treatment_records')
    date_of_treatment = models.DateField()
    description_of_work_done = models.TextField()
    follow_up_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient} - {self.date_of_treatment}"
    
    class Meta:
        ordering = ['-date_of_treatment']
