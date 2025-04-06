from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, MedicalHistoryViewSet, MedicationViewSet, DocumentViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'medical-history', MedicalHistoryViewSet, basename='medical-history')
router.register(r'medications', MedicationViewSet, basename='medication')
router.register(r'documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('api/', include(router.urls)),  # All API endpoints are automatically handled
]
