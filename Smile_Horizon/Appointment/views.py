from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Appointment, TreatmentRecord
from .serializers import AppointmentSerializer, TreatmentRecordSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from rest_framework import status
from rest_framework.response import Response
from django.core.exceptions import ValidationError

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class TreatmentRecordViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for managing Treatment Records
    """
    queryset = TreatmentRecord.objects.all()
    serializer_class = TreatmentRecordSerializer
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['patient__id', 'doctor__id', 'date_of_treatment']  # Use related fields for filtering
    search_fields = ['patient__first_name', 'doctor__first_name']  # Use '__' for referencing related fields
    ordering_fields = ['date_of_treatment']

    def perform_create(self, serializer):
        """Assigns the logged-in user as the doctor when creating a treatment record."""
        serializer.save(doctor=self.request.user)  # ✅ Only TreatmentRecord has doctor

    """
    API ViewSet for managing Treatment Records
    """
    queryset = TreatmentRecord.objects.all()
    serializer_class = TreatmentRecordSerializer
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['patient', 'doctor', 'date_of_treatment']
    search_fields = ['patient_first_name', 'doctor_first_name']
    ordering_fields = ['date_of_treatment']

    def perform_create(self, serializer):
        """Assigns the logged-in user as the doctor when creating a treatment record."""
        serializer.save(doctor=self.request.user)  # ✅ Only TreatmentRecord has doctor


