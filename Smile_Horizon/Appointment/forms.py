from django import forms
from .models import Appointment, TreatmentRecord, TreatmentType

class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['patient', 'appointment_date', 'appointment_time', 'treatment_type', 'reason', 'status', 'notes']
        widgets = {
            'appointment_date': forms.DateInput(attrs={'type': 'date'}),
            'appointment_time': forms.TimeInput(attrs={'type': 'time'}),
            'reason': forms.Textarea(attrs={'rows': 3}),
            'notes': forms.Textarea(attrs={'rows': 2}),
        }

class TreatmentRecordForm(forms.ModelForm):
    class Meta:
        model = TreatmentRecord
        fields = ['description_of_work_done', 'follow_up_date', 'notes']
        widgets = {
            'follow_up_date': forms.DateInput(attrs={'type': 'date'}),
            'description_of_work_done': forms.Textarea(attrs={'rows': 4}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }

class TreatmentTypeForm(forms.ModelForm):
    class Meta:
        model = TreatmentType
        fields = ['name', 'description', 'average_duration']