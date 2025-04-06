from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'prescriptions', views.PrescriptionViewSet, basename='prescription')
router.register(r'medicines', views.MedicineViewSet, basename='medicine')
router.register(r'prescribed-medicines', views.PrescribedMedicineViewSet, basename='prescribed-medicine')
router.register(r'tooth-status', views.ToothStatusViewSet, basename='tooth-status')

urlpatterns = [
    path('api/', include(router.urls)),
    # Add direct paths for common operations
    path('api/prescriptions/create_from_treatment/', 
         views.PrescriptionViewSet.as_view({'post': 'create_from_treatment'}), 
         name='prescription-create-from-treatment'),
    path('api/tooth-status/update/', 
         views.ToothStatusViewSet.as_view({'post': 'update_status'}), 
         name='update-tooth-status'),
    path('api/tooth-status/patient/', 
         views.ToothStatusViewSet.as_view({'get': 'patient_teeth'}), 
         name='patient-teeth'),
]
