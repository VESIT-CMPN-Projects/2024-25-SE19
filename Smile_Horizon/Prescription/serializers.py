from rest_framework import serializers
from .models import Medicine, Prescription, PrescribedMedicine, ToothStatus
from Patient.models import Patient
from django.utils import timezone


class MedicineSerializer(serializers.ModelSerializer):
    """
    Serializer for the Medicine model.
    """
    class Meta:
        model = Medicine
        fields = ['id', 'name', 'description', 'dosage_instructions', 'is_active', 'created_at', 'updated_at']


class PrescribedMedicineSerializer(serializers.ModelSerializer):
    """
    Serializer for the PrescribedMedicine model.
    """
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)
    medicine_description = serializers.CharField(source='medicine.description', read_only=True)

    class Meta:
        model = PrescribedMedicine
        fields = [
            'id', 'prescription', 'medicine', 'medicine_name', 'medicine_description',
            'dosage', 'frequency', 'duration', 'special_instructions', 'is_taken'
        ]
        extra_kwargs = {
            'prescription': {'required': False},
            'medicine': {'required': False}
        }
    
    def create(self, validated_data):
        # Handle case where medicine is passed as a string name instead of an ID
        medicine_name = self.context.get('request').data.get('medicine_name') if self.context.get('request') else None
        
        if medicine_name and 'medicine' not in validated_data:
            medicine, created = Medicine.objects.get_or_create(
                name=medicine_name,
                defaults={
                    'description': f"Added on {timezone.now().date()}",
                    'is_active': True
                }
            )
            validated_data['medicine'] = medicine
            
        return super().create(validated_data)


class ToothStatusSerializer(serializers.ModelSerializer):
    """Serializer for the ToothStatus model"""
    class Meta:
        model = ToothStatus
        fields = ['id', 'patient', 'tooth_number', 'status', 'notes', 'treatment_date', 'last_updated']


class PrescriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Prescription model.
    """
    prescribed_medicines = PrescribedMedicineSerializer(many=True, source='prescribedmedicine_set', read_only=True)
    patient_name = serializers.SerializerMethodField()
    patient_id = serializers.IntegerField(source='patient.id', read_only=True)
    work_done_details = serializers.CharField(source='work_done', read_only=True)
    pending_work_details = serializers.CharField(source='pending_work', read_only=True)
    treated_tooth_details = ToothStatusSerializer(source='treated_tooth', read_only=True)

    class Meta:
        model = Prescription
        fields = [
            'id', 'patient', 'patient_id', 'patient_name', 'appointment', 'treatment_record', 
            'notes', 'work_done', 'work_done_details', 'pending_work', 'pending_work_details',
            'status', 'prescription_date', 'treated_tooth', 'treated_tooth_details',
            'created_at', 'updated_at', 'prescribed_medicines'
        ]
        read_only_fields = ['patient_name', 'patient_id', 'work_done_details', 'pending_work_details']
        extra_kwargs = {
            'patient': {'required': False},
            'appointment': {'required': False},
            'treatment_record': {'required': False},
        }

    def get_patient_name(self, obj):
        """
        Get the patient's full name from various possible sources.
        """
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}"
        elif obj.appointment and obj.appointment.patient:
            return f"{obj.appointment.patient.first_name} {obj.appointment.patient.last_name}"
        elif obj.treatment_record and obj.treatment_record.patient:
            return f"{obj.treatment_record.patient.first_name} {obj.treatment_record.patient.last_name}"
        return "Unknown Patient"
    
    def create(self, validated_data):
        # Extract additional data from the request
        request = self.context.get('request')
        if request:
            # Handle direct patient ID provided in request
            patient_id = request.data.get('patient_id')
            if patient_id and 'patient' not in validated_data:
                try:
                    patient = Patient.objects.get(id=patient_id)
                    validated_data['patient'] = patient
                except Patient.DoesNotExist:
                    raise serializers.ValidationError({'patient_id': f'Patient with ID {patient_id} does not exist'})
                
            # Handle prescription text from frontend
            prescription_text = request.data.get('prescription_text') or request.data.get('prescription')
            if prescription_text and 'notes' not in validated_data:
                validated_data['notes'] = prescription_text
                
            # Handle work done from frontend
            work_done = request.data.get('work_done')
            if work_done and 'work_done' not in validated_data:
                validated_data['work_done'] = work_done
                
            # Handle pending work from frontend
            pending_work = request.data.get('pending_work')
            if pending_work and 'pending_work' not in validated_data:
                validated_data['pending_work'] = pending_work
                
        prescription = super().create(validated_data)
        
        # Handle adding medicine directly during prescription creation
        if request:
            post_medication = request.data.get('post_medication')
            if post_medication:
                PrescribedMedicine.objects.create(
                    prescription=prescription,
                    medicine=Medicine.objects.get_or_create(
                        name=post_medication,
                        defaults={'description': 'Added from patient details form'}
                    )[0],
                    dosage='As directed',
                    frequency='As needed',
                    duration='As required'
                )
                
        return prescription


class SimplePrescriptionSerializer(serializers.ModelSerializer):
    """
    A simplified version of the prescription serializer for listing purposes.
    """
    patient_name = serializers.SerializerMethodField()
    medicine_count = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = ['id', 'patient_name', 'prescription_date', 'status', 'medicine_count']

    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}"
        elif obj.appointment and obj.appointment.patient:
            return f"{obj.appointment.patient.first_name} {obj.appointment.patient.last_name}"
        elif obj.treatment_record and obj.treatment_record.patient:
            return f"{obj.treatment_record.patient.first_name} {obj.treatment_record.patient.last_name}"
        return "Unknown Patient"
    
    def get_medicine_count(self, obj):
        return obj.prescribedmedicine_set.count()


class PrescriptionCreateFromTreatmentSerializer(serializers.Serializer):
    """
    Special serializer for creating prescriptions directly from the treatment form.
    This matches the frontend data structure from patientdetails.jsx.
    """
    patient_id = serializers.IntegerField(required=True)
    prescription = serializers.CharField(required=False, allow_blank=True)
    work_done = serializers.CharField(required=False, allow_blank=True)
    pending_work = serializers.CharField(required=False, allow_blank=True)
    post_medication = serializers.CharField(required=False, allow_blank=True)
    treated_tooth_number = serializers.IntegerField(required=False, allow_null=True)
    tooth_status = serializers.CharField(required=False, allow_blank=True)
    
    def create(self, validated_data):
        patient_id = validated_data.get('patient_id')
        prescription_text = validated_data.get('prescription', '')
        work_done = validated_data.get('work_done', '')
        pending_work = validated_data.get('pending_work', '')
        treated_tooth_number = validated_data.get('treated_tooth_number')
        tooth_status = validated_data.get('tooth_status')
        
        try:
            # Create the prescription with tooth data if provided
            prescription = Prescription.create_from_frontend(
                patient_id=patient_id,
                prescription_text=prescription_text,
                work_done=work_done,
                pending_work=pending_work,
                treated_tooth_number=treated_tooth_number,
                tooth_status=tooth_status
            )
            
            # Add post-medication if provided
            post_medication = validated_data.get('post_medication')
            if post_medication and post_medication.strip():
                PrescribedMedicine.add_medicine_to_prescription(
                    prescription_id=prescription.id,
                    medicine_name=post_medication
                )
                
            return prescription
        except Exception as e:
            raise serializers.ValidationError(str(e))
    
    def to_representation(self, instance):
        return PrescriptionSerializer(instance).data