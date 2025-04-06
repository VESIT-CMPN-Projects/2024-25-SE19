from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, TreatmentRecordViewSet

# Create a router for the API endpoints
router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'treatment-records', TreatmentRecordViewSet, basename='treatment-record')

urlpatterns = [

    path('api/', include(router.urls)),  # Include API routes
]
#     path('create/', views.appointment_create, name='appointment_create'),
#     path('', views.appointment_list, name='appointment_list'),
#     path('<int:pk>/update/', views.appointment_update, name='appointment_update'),
#     path('<int:pk>/check-in/', views.appointment_check_in, name='appointment_check_in'),
#     path('<int:appointment_pk>/treatment-record/create/', views.treatment_record_create, name='treatment_record_create'),
# ]

