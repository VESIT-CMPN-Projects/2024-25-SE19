from rest_framework import serializers
from .models import Patient, MedicalHistory, Medication, Document, TeethStatus


class MedicalHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for patient's medical history records.
    """
    class Meta:
        model = MedicalHistory
        fields = '__all__'
        extra_kwargs = {'patient': {'read_only': True}}  # Ensures patient is set via view logic


class MedicationSerializer(serializers.ModelSerializer):
    """
    Serializer for patient's medications.
    """
    class Meta:
        model = Medication
        fields = '__all__'
        extra_kwargs = {'patient': {'read_only': True}}


class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for patient documents (reports, X-rays, etc.).
    """
    class Meta:
        model = Document
        fields = '__all__'
        extra_kwargs = {'patient': {'read_only': True}}


class TeethStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for tracking the status of individual teeth.
    """
    class Meta:
        model = TeethStatus
        fields = ["tooth_number", "status"]


class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer for basic patient details (list & create views).
    """
    last_visit = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'age', 'gender', 'contact_number',
            'email', 'address', 'blood_group', 'allergies', 'existing_conditions',
            'status', 'last_visit', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }


class PatientDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for a patient including related records.
    """
    medical_histories = MedicalHistorySerializer(many=True, read_only=True)
    medications = MedicationSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    teeth_status = TeethStatusSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'age', 'gender', 'contact_number',
            'email', 'address', 'blood_group', 'allergies', 'existing_conditions',
            'status', 'last_visit', 'created_at', 'updated_at',
            'medical_histories', 'medications', 'documents', 'teeth_status'
        ]
