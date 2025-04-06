from django.shortcuts import render, redirect
from django.utils import timezone

def dashboard(request):
    """
    Display the main dashboard without requiring authentication
    """
    context = {
        'doctor_name': 'Doctor',
        'today': timezone.now(),
        'today_appointments': 0,  # Placeholder
        'patients_treated': 0,    # Placeholder
        'pending_followups': 0,   # Placeholder
        'week_days': [],          # Placeholder
        'day_stats': {
            'date': timezone.now(),
            'total_appointments': 0,
            'completed': 0,
            'scheduled': 0,
            'cancelled': 0
        }
    }
    return render(request, 'core/dashboard.html', context)

def login_view(request):
    """
    Temporary login view that redirects to the dashboard
    """
    return redirect('dashboard')