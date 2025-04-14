from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action

from .models import Patient, MedicalHistory, Medication, Document, ToothStatus
from .serializers import (
    PatientSerializer,
    PatientDetailSerializer,
    MedicalHistorySerializer,
    MedicationSerializer,
    DocumentSerializer,
    ToothStatusSerializer,
)


class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage patients (list, create, retrieve, update, delete).
    """
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        """
        Return detailed serializer for patient detail view.
        """
        if self.action == 'retrieve':
            return PatientDetailSerializer
        return PatientSerializer

    def get_queryset(self):
        """
        Apply search and filter queries dynamically.
        """
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', '')
        status_filter = self.request.query_params.get('status', '')

        if search_query:
            queryset = queryset.filter(
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(contact_number__icontains=search_query) |
                Q(email__icontains=search_query)
            )

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Override create method to print validation errors.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Print validation errors to the console or log
            print(serializer.errors)  # This will print the errors in the server logs
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_teeth_status(self, request, pk=None):
        """
        Custom action to update a patient's teeth status.
        """
        patient = get_object_or_404(Patient, pk=pk)
        teeth_data = request.data.get("teeth_status", [])

        for tooth_data in teeth_data:
            tooth_number = tooth_data.get("tooth_number")
            status = tooth_data.get("status")

            if tooth_number and status:
                tooth, created = ToothStatus.objects.update_or_create(
                    patient=patient, tooth_number=tooth_number, defaults={"status": status}
                )

        return Response({"message": "Teeth status updated successfully"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def tooth_status(self, request, pk=None):
        """Get tooth status for a specific patient"""
        try:
            patient = self.get_object()
            teeth = ToothStatus.objects.filter(patient=patient)
            serializer = ToothStatusSerializer(teeth, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error fetching tooth status: {e}")
            return Response([])  # Return empty list if error
    
    @action(detail=True, methods=['post'])
    def update_tooth_status(self, request, pk=None):
        """Update tooth status for a specific patient"""
        try:
            patient = self.get_object()
            tooth_number = request.data.get('tooth_number')
            status = request.data.get('status')
            notes = request.data.get('notes', '')
            
            # Update or create the tooth status
            tooth, created = ToothStatus.objects.update_or_create(
                patient=patient,
                tooth_number=tooth_number,
                defaults={'status': status, 'notes': notes}
            )
            
            serializer = ToothStatusSerializer(tooth)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error updating tooth status: {e}")
            return Response({"error": str(e)}, status=400)


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage a patient's medical history.
    """
    queryset = MedicalHistory.objects.all().order_by('-diagnosis_date')
    serializer_class = MedicalHistorySerializer
    permission_classes = [AllowAny]


class MedicationViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage patient medications.
    """
    queryset = Medication.objects.all().order_by('-prescribed_date')
    serializer_class = MedicationSerializer
    permission_classes = [AllowAny]


class DocumentViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage patient documents (X-rays, reports, etc.).
    """
    queryset = Document.objects.all().order_by('-upload_date')
    serializer_class = DocumentSerializer
    permission_classes = [AllowAny]
