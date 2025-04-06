from django import forms
from .models import Patient, MedicalHistory, Medication, Document

class PatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = [
            'first_name', 'last_name', 'age', 'gender', 'contact_number', 
            'email', 'address', 'blood_group', 'allergies', 
            'existing_conditions', 'status'
        ]
        widgets = {
            'address': forms.Textarea(attrs={'rows': 3}),
            'allergies': forms.Textarea(attrs={'rows': 3}),
            'existing_conditions': forms.Textarea(attrs={'rows': 3}),
        }

class MedicalHistoryForm(forms.ModelForm):
    class Meta:
        model = MedicalHistory
        fields = ['condition', 'diagnosis_date', 'treatment', 'notes']
        widgets = {
            'diagnosis_date': forms.DateInput(attrs={'type': 'date'}),
            'treatment': forms.Textarea(attrs={'rows': 3}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }

class MedicationForm(forms.ModelForm):
    class Meta:
        model = Medication
        fields = ['name', 'dosage', 'frequency', 'status', 'prescribed_date', 'end_date', 'notes']
        widgets = {
            'prescribed_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
            'notes': forms.Textarea(attrs={'rows': 2}),
        }

class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ['title', 'file', 'document_type', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 2}),
        }