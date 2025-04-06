from rest_framework import serializers
from .models import Appointment, TreatmentRecord
from Patient.models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["first_name", "last_name"]

class AppointmentSerializer(serializers.ModelSerializer):
    patient_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'appointment_date', 'appointment_time', 'reason', 'status', 'notes', 'patient_info']
        
    def get_patient_info(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}"
        return "Unknown Patient"

class TreatmentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreatmentRecord
        fields = '_all_'

