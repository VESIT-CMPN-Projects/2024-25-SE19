  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import './appointments.css';

  // Define API endpoints
  const API_URL = "http://localhost:8000/appointments/api/appointments/";
  const PATIENTS_API_URL = "http://localhost:8000/api/patients/";

  const Appointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAppointment, setNewAppointment] = useState({
      patient: "", // Patient ID
      appointment_date: "",
      appointment_time: "",
      reason: "",
      status: "SCHEDULED",
    });

    // Fetch appointments and patients from the backend
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch appointments
          const appointmentsResponse = await axios.get(API_URL);
          setAppointments(appointmentsResponse.data);
          
          // Fetch patients for the dropdown
          const patientsResponse = await axios.get(PATIENTS_API_URL);
          setPatients(patientsResponse.data);
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load data. Please try again later.");
          setLoading(false);
        }
      };
      
      fetchData();
    }, []);

    // Handle form changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewAppointment({ ...newAppointment, [name]: value });
    };

    // Add new appointment
    const handleAddAppointment = async (e) => {
      e.preventDefault();
      
      if (!newAppointment.patient || !newAppointment.appointment_date || 
          !newAppointment.appointment_time || !newAppointment.reason) {
        alert("Please fill all fields.");
        return;
      }

      try {
        const response = await axios.post(API_URL, newAppointment);
        setAppointments([...appointments, response.data]);
        setNewAppointment({
          patient: "",
          appointment_date: "",
          appointment_time: "",
          reason: "",
          status: "SCHEDULED",
        });
        alert("Appointment added successfully!");
      } catch (error) {
        alert("Failed to add appointment. " + (error.response?.data?.detail || error.message));
        console.error("Error adding appointment:", error.response?.data || error.message);
      }
    };

    // Delete an appointment
    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this appointment?")) {
        try {
          await axios.delete(`${API_URL}${id}/`);
          setAppointments(appointments.filter((appt) => appt.id !== id));
          alert("Appointment deleted successfully!");
        } catch (error) {
          alert("Failed to delete appointment. " + (error.response?.data?.detail || error.message));
          console.error("Error deleting appointment:", error.response?.data || error.message);
        }
      }
    };

    // Navigate to appointment details
    const handleAppointmentClick = (id) => {
      console.log(`Navigating to appointment ${id}`);
      navigate(`/appointment/${id}`);
    };

    // Filter appointments by patient name
    const filteredAppointments = appointments.filter((appt) => {
      const patientName = appt.patient_info?.toLowerCase() || "";
      return patientName.includes(searchTerm.toLowerCase());
    });

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format time for display
    const formatTime = (timeString) => {
      if (!timeString) return "";
      try {
        // Handle API format (e.g., "14:30:00")
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${hour12}:${minutes} ${period}`;
      } catch (e) {
        return timeString; // Return original if parsing fails
      }
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
      switch (status?.toUpperCase()) {
        case 'SCHEDULED': return 'status-scheduled';
        case 'CONFIRMED': return 'status-confirmed';
        case 'COMPLETED': return 'status-completed';
        case 'CANCELLED': return 'status-cancelled';
        case 'NO_SHOW': return 'status-no-show';
        default: return 'status-scheduled';
      }
    };

    if (loading) {
      return <div className="loading">Loading appointments...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="appointments-page">
        <h1>Appointments</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {/* Appointment Form */}
        <form onSubmit={handleAddAppointment} className="appointment-form">
          <select
            name="patient"
            value={newAppointment.patient}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </option>
            ))}
          </select>
          
          <input
            type="date"
            name="appointment_date"
            value={newAppointment.appointment_date}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="time"
            name="appointment_time"
            value={newAppointment.appointment_time}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="text"
            name="reason"
            placeholder="Reason for Appointment"
            value={newAppointment.reason}
            onChange={handleInputChange}
            required
          />
          
          <select
            name="status"
            value={newAppointment.status}
            onChange={handleInputChange}
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
          </select>
          
          <button type="submit">Add Appointment</button>
        </form>

        {/* Appointment List */}
        <ul className="appointment-list">
          {filteredAppointments.length ? (
            filteredAppointments.map((appt) => (
              <li key={appt.id} className="appointment-item">
                <div className="appointment-info">
                  <button 
                    className="patient-name-button" 
                    onClick={() => handleAppointmentClick(appt.id)}
                  >
                    {appt.patient_info || "Unknown Patient"}
                  </button>
                  <div className="appointment-date-time">
                    {formatDate(appt.appointment_date)} at {formatTime(appt.appointment_time)}
                  </div>
                  <div className="appointment-reason">
                    <span className="label">Reason:</span> {appt.reason}
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge ${getStatusBadgeClass(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
                <div className="appointment-actions">
                  <button 
                    onClick={() => handleAppointmentClick(appt.id)} 
                    className="view-btn"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDelete(appt.id)} 
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="no-appointments">No appointments found.</li>
          )}
        </ul>
      </div>
    );
  };

  export default Appointments;