# SmileHorizon - Dental Clinic Management System

## Overview

SmileHorizon is a modern dental clinic management system built with React and Django REST Framework. It provides a user-friendly interface for managing patients, appointments, and dental records.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Installation Guide](#installation-guide)
3. [Features & Functionality](#features--functionality)
4. [Project Structure](#project-structure)
5. [Future Enhancements](#future-enhancements)

## System Architecture

SmileHorizon uses a modern tech stack:

- **Frontend**: React.js with Material-UI components
- **Backend**: Django REST Framework 
- **Database**: SQLite
- **API Communication**: Axios
- **Styling**: CSS Modules, Tailwind CSS

## Installation Guide

### Prerequisites
- Python 3.12+
- Node.js 16+
- npm/yarn

### Backend Setup

```bash```
# Navigate to Django project
cd Smile_Horizon

# Create virtual environment
python -m venv env

# Activate virtual environment (Windows)
env\Scripts\activate

# Install dependencies
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install django-filter

# Apply migrations
python manage.py migrate

# Run server
python manage.py runserver

### Frontend Setup
# Navigate to React project
cd react_smilehorizon

# Install dependencies
npm install

# Run development server
npm start


### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/Ghostblaster08/Smile_Horizon.git
cd Smile_Horizon
```

2. **Create and activate a virtual environment**

```bash
python -m venv env
```

- **On Windows:**

```bash
env\Scripts\activate
```

- **On macOS/Linux:**

```bash
source env/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Apply migrations**

```bash
python manage.py migrate
```

5. **Create a superuser**

```bash
python manage.py createsuperuser
```

6. **Run the development server**

```bash
python manage.py runserver
```

7. **Access the application**

- Main site: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Admin site: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

## Project Structure

BACKEND
Smile_Horizon/
├── core/
│   ├── views.py          # Core business logic
│   ├── urls.py           # URL routing
│   └── models.py         # Base models
│
├── Patient/
│   ├── models.py         # Patient data models
│   ├── serializers.py    # API serializers
│   ├── views.py          # Patient endpoints
│   └── urls.py          # Patient routes
│
├── Appointment/
│   ├── models.py         # Appointment schemas
│   ├── serializers.py    # Data serialization
│   ├── views.py          # Appointment logic
│   └── urls.py          # Route definitions
│
└── settings/
    ├── base.py          # Base settings
    ├── development.py   # Dev environment
    └── production.py    # Prod environment


FRONTEND
react_smilehorizon/
├── src/
│   ├── components/
│   │   ├── DentalChart/
│   │   │   ├── index.jsx
│   │   │   └── styles.css
│   │   ├── AppointmentCalendar/
│   │   │   ├── index.jsx
│   │   │   └── styles.css
│   │   └── PatientForm/
│   │       ├── index.jsx
│   │       └── styles.css
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── PatientList/
│   │   ├── AppointmentManager/
│   │   └── Settings/
│   │
│   ├── services/
│   │   ├── api.js       # API integration
│   │   └── utils.js     # Helper functions
│   │
│   └── assets/
│       ├── images/
│       └── icons/
│
└── public/
    └── index.html

## Database Models

### User App
- **User**: Extends Django's AbstractUser to include additional fields for doctors and staff.

### Patient App
- **Patient**: Contains patient information.
- **MedicalHistory**: Stores patient medical history records.
- **Medication**: Tracks current and past medications for patients.
- **Document**: Stores patient documents (x-rays, reports, etc.).

### Appointment App
- **TreatmentType**: Defines types of dental treatments offered.
- **Appointment**: Manages patient appointments.
- **TreatmentRecord**: Records treatments performed on patients.

### Prescription App
- **Medicine**: Stores information about commonly prescribed medicines.
- **Prescription**: Links appointments with prescribed medicines.
- **PrescribedMedicine**: Through model for Prescription and Medicine.

## Features & Functionality

- **Dashboard Features**: Modern UI with statistics cards
                          Interactive calendar
                          Day-wise appointment tracking
- **Patient Management**: Add/Edit patient records
                          Detailed dental chart
                          Treatment history tracking
                          Status updates (New, Ongoing, Completed)
- **Appointment System**: Schedule new appointments
                          View appointment details
                          Update appointment status
                          Treatment notes and records
- **Treatment Management**: Record treatment
                            view history
                            schedule follow-ups.
- **Dental Chart**: Interactive tooth selection
                            Status updates for each tooth
                            Multiple treatment options (Normal, Filling, Extraction, etc.)
                            Treatment history per tooth
- **Prescription System**: Record medications
                           Track treatment progress
                           Store post-treatment instructions

## User Guide

### User Roles
- **Doctors**: Full access to patient information, appointments, treatments.
- **Staff**: Limited access for patient registration and appointment scheduling.

### Common Tasks
- **Creating a Patient**: Fill in the patient information form and save.
- **Scheduling an Appointment**: Select date, time, treatment type, and save.
- **Recording a Treatment**: Enter details and follow-up information.
- **Creating a Prescription**: Select medicines, enter dosage, and save.

## Contributing Guidelines

### Development Setup
1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Implement changes, write tests, and run:

```bash
python manage.py test
```

4. Submit a pull request.

### Coding Standards
- Follow PEP 8 for Python code.
- Use descriptive variable and function names.
- Include docstrings for modules, classes, and functions.

## Future Enhancements

- **Billing and Invoicing Module**: Generate invoices, track payments.
- **Patient Portal**: Online appointment booking, secure messaging.
- **Advanced Reporting**: Treatment success rates, revenue analysis.
- **Inventory Management**: Track dental supplies, automated reordering.
- **Mobile Application**: iOS/Android support, push notifications.
- **Integration with Dental Imaging Systems**: Direct import of X-rays.

---
_Last Updated: 25 March, 2025_

**© 2025 SmileHorizon - Developed by Ghostblaster08, Yash-Mahajan-28, Rahulgg22, ei-akulxx**

