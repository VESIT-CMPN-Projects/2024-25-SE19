import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./apmt_details.css";

const AppointmentDetails = () => {
  const { id } = useParams(); // Get the id from the URL
  const navigate = useNavigate();
  
  // Base API URLs
  const APPOINTMENT_API_URL = "http://localhost:8000/appointments/api/appointments";
  const PATIENT_API_URL = "http://localhost:8000/api/patients";
  const PRESCRIPTION_API_URL = "http://localhost:8000/prescriptions/api/prescriptions";
  const MEDICINE_API_URL = "http://localhost:8000/prescriptions/api/medicines";
  const TOOTH_STATUS_API_URL = "http://localhost:8000/prescriptions/api/tooth-status";
  
  // States for appointment and patient information
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medicineList, setMedicineList] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  const [previousPrescriptions, setPreviousPrescriptions] = useState([]);
  
  // States for dental work and prescriptions
  const [currentNotes, setCurrentNotes] = useState("");
  const [newPrescription, setNewPrescription] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [workToBeDone, setWorkToBeDone] = useState("");
  
  // Teeth chart state
  const [teethStatus, setTeethStatus] = useState(Array(32).fill("normal"));
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Fetch appointment data with detailed logging
  useEffect(() => {
    const fetchAppointmentData = async () => {
      setLoading(true);
      setSaveError(null);
      
      try {
        console.log(`Fetching appointment with ID: ${id} from ${APPOINTMENT_API_URL}/${id}/`);
        
        // Fetch the appointment details
        const appointmentResponse = await axios.get(`${APPOINTMENT_API_URL}/${id}/`);
        console.log("Appointment data received:", appointmentResponse.data);
        setAppointment(appointmentResponse.data);
        
        // Fetch the patient details using the patient_id from the appointment
        if (appointmentResponse.data.patient) {
          console.log(`Fetching patient with ID: ${appointmentResponse.data.patient} from ${PATIENT_API_URL}/${appointmentResponse.data.patient}/`);
          
          const patientResponse = await axios.get(`${PATIENT_API_URL}/${appointmentResponse.data.patient}/`);
          console.log("Patient data received:", patientResponse.data);
          setPatient(patientResponse.data);
          
          // Fetch the patient's teeth status
          console.log(`Fetching teeth status for patient ID: ${patientResponse.data.id} from ${TOOTH_STATUS_API_URL}/patient/?patient_id=${patientResponse.data.id}`);
          
          try {
            const teethStatusResponse = await axios.get(`${TOOTH_STATUS_API_URL}/patient/?patient_id=${patientResponse.data.id}`);
            console.log("Teeth status data received:", teethStatusResponse.data);
            
            // Initialize teeth status array with defaults
            const initialTeethStatus = Array(32).fill("normal");
            
            // Update with data from the API
            if (Array.isArray(teethStatusResponse.data)) {
              teethStatusResponse.data.forEach(tooth => {
                if (tooth.tooth_number >= 1 && tooth.tooth_number <= 32) {
                  initialTeethStatus[tooth.tooth_number - 1] = tooth.status;
                } else {
                  console.warn(`Invalid tooth number received: ${tooth.tooth_number}`);
                }
              });
            } else {
              console.warn("Teeth status data is not an array:", teethStatusResponse.data);
            }
            
            setTeethStatus(initialTeethStatus);
          } catch (teethError) {
            console.error("Error fetching teeth status:", teethError);
            console.log("Server response:", teethError.response?.data);
            console.log("Continuing with default teeth status values");
            // Continue with default teeth status
          }
          
          // Fetch patient's medical history (treatment records)
          console.log(`Fetching medical history for patient ID: ${patientResponse.data.id} from ${PATIENT_API_URL}/${patientResponse.data.id}/medical_history/`);
          
          try {
            const historyResponse = await axios.get(`${PATIENT_API_URL}/${patientResponse.data.id}/medical_history/`);
            console.log("Medical history data received:", historyResponse.data);
            setPatientHistory(historyResponse.data || []);
          } catch (historyError) {
            console.error("Error fetching medical history:", historyError);
            console.log("Server response:", historyError.response?.data);
            console.log("Continuing with empty medical history");
            setPatientHistory([]);
          }
          
          // Fetch patient's previous prescriptions
          console.log(`Fetching prescriptions for patient ID: ${patientResponse.data.id} from ${PRESCRIPTION_API_URL}/?patient=${patientResponse.data.id}`);
          
          try {
            const prescriptionsResponse = await axios.get(`${PRESCRIPTION_API_URL}/?patient=${patientResponse.data.id}`);
            console.log("Prescriptions data received:", prescriptionsResponse.data);
            setPreviousPrescriptions(prescriptionsResponse.data || []);
          } catch (prescriptionsError) {
            console.error("Error fetching prescriptions:", prescriptionsError);
            console.log("Server response:", prescriptionsError.response?.data);
            console.log("Continuing with empty prescriptions");
            setPreviousPrescriptions([]);
          }
        } else {
          console.warn("No patient ID found in appointment data");
        }
        
        // Fetch available medicines for the dropdown
        console.log(`Fetching medicines from ${MEDICINE_API_URL}/?active_only=true`);
        
        try {
          const medicinesResponse = await axios.get(`${MEDICINE_API_URL}/?active_only=true`);
          console.log("Medicines data received:", medicinesResponse.data);
          setMedicineList(medicinesResponse.data || []);
        } catch (medicinesError) {
          console.error("Error fetching medicines:", medicinesError);
          console.log("Server response:", medicinesError.response?.data);
          console.log("Continuing with empty medicine list");
          setMedicineList([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Main error fetching appointment data:", error);
        console.log("Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        
        setLoading(false);
        setSaveError(`Failed to load appointment data: ${error.message}. Please check the console for details and ensure your backend server is running.`);
      }
    };

    if (id) {
      fetchAppointmentData();
    } else {
      setLoading(false);
      setSaveError("No appointment ID provided");
    }
  }, [id]);

  const handleToothClick = (index) => {
    setSelectedTooth(index);
  };

  // Update tooth status with API call
  const handleStatusChange = async (status) => {
    if (!patient) return;
    
    try {
      const updatedTeethStatus = [...teethStatus];
      updatedTeethStatus[selectedTooth] = status;
      setTeethStatus(updatedTeethStatus);

      // Update tooth status in the backend
      await axios.post(`${TOOTH_STATUS_API_URL}/update/`, {
        patient_id: patient.id,
        tooth_number: selectedTooth + 1,
        status: status,
        notes: `Updated during appointment on ${new Date().toISOString().split('T')[0]}`
      });
    } catch (error) {
      console.error("Error updating tooth status:", error);
      // Revert UI change if API call fails
      const oldStatus = [...teethStatus];
      setTeethStatus(oldStatus);
      setSaveError("Failed to update tooth status. Please try again.");
    }
  };

  const handleAddMedicine = () => {
    if (selectedMedicine && dosage && frequency && duration) {
      // If selectedMedicine is an object (from API), get its name or id
      const medicineValue = typeof selectedMedicine === 'object' ? 
        selectedMedicine.name : selectedMedicine;
      
      const newMedicine = {
        name: medicineValue,
        dosage,
        frequency,
        duration
      };
      setNewPrescription([...newPrescription, newMedicine]);
      
      // Reset form
      setSelectedMedicine("");
      setDosage("");
      setFrequency("");
      setDuration("");
    }
  };

  const handleRemoveMedicine = (index) => {
    const updatedPrescription = [...newPrescription];
    updatedPrescription.splice(index, 1);
    setNewPrescription(updatedPrescription);
  };

  // Save all appointment details including prescription
  const handleSaveAppointment = async () => {
    if (!patient || !appointment) {
      setSaveError("Patient or appointment information is missing.");
      return;
    }
    
    setSaveError(null);
    setLoading(true);
    
    try {
      // Step 1: Update appointment notes
      await axios.patch(`${APPOINTMENT_API_URL}/${id}/`, {
        notes: currentNotes,
        status: 'COMPLETED' // Optionally update the appointment status
      });
      
      // Step 2: Create a new prescription if there are medicines or notes
      if (newPrescription.length > 0 || currentNotes || workToBeDone) {
        // Create the prescription
        const prescriptionResponse = await axios.post(`${PRESCRIPTION_API_URL}/create_from_treatment/`, {
          patient_id: patient.id,
          prescription: currentNotes,
          work_done: "",
          pending_work: workToBeDone,
          appointment_id: id
        });
        
        // For each medicine in the new prescription, add it to the created prescription
        for (const medicine of newPrescription) {
          await axios.post(`${PRESCRIPTION_API_URL}/${prescriptionResponse.data.id}/add_medicine/`, {
            medicine_name: medicine.name,
            dosage: medicine.dosage,
            frequency: medicine.frequency,
            duration: medicine.duration
          });
        }
      }
      
      // If a tooth is selected, make sure its status is recorded with the appointment
      if (selectedTooth !== null) {
        await axios.post(`${TOOTH_STATUS_API_URL}/update/`, {
          patient_id: patient.id,
          tooth_number: selectedTooth + 1,
          status: teethStatus[selectedTooth],
          notes: `Updated during appointment ${id} on ${new Date().toISOString().split('T')[0]}`
        });
      }
      
      setLoading(false);
      alert("Appointment details saved successfully!");
      navigate("/appointments"); // Redirect to appointments list
    } catch (error) {
      console.error("Error saving appointment details:", error);
      setLoading(false);
      setSaveError("Failed to save appointment details. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading appointment details...</div>;
  }

  return (
    <div className="appointment-details-container">
      <h1>Appointment Details</h1>
      <p>Viewing details for appointment ID: {id}</p>
      
      {saveError && (
        <div className="error-message">
          {saveError}
        </div>
      )}
      
      <div className="appointment-header">
        <div className="appointment-meta">
          <p><strong>Date:</strong> {appointment?.date || 'N/A'}</p>
          <p><strong>Time:</strong> {appointment?.time || 'N/A'}</p>
          <p><strong>Reason:</strong> {appointment?.reason || 'N/A'}</p>
          <p>
            <strong>Status:</strong> 
            <span className={`status-${appointment?.status?.toLowerCase() || 'unknown'}`}>
              {appointment?.status || 'UNKNOWN'}
            </span>
          </p>
        </div>
      </div>

      <div className="patient-card">
        <h2>Patient Information</h2>
        {patient ? (
          <div className="patient-info">
            <div className="info-column">
              <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
              <p><strong>Age:</strong> {patient.age || 'N/A'}</p>
              <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
            </div>
            <div className="info-column">
              <p><strong>Contact:</strong> {patient.phone_number || 'N/A'}</p>
              <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
              <p><strong>Blood Group:</strong> {patient.blood_group || 'N/A'}</p>
            </div>
            <div className="info-column">
              <p><strong>Allergies:</strong> {patient.allergies || 'None'}</p>
              <p><strong>Existing Conditions:</strong> {patient.existing_conditions || 'None'}</p>
            </div>
          </div>
        ) : (
          <p>No patient information available</p>
        )}
      </div>

      <div className="previous-treatments">
        <h2>Medical History</h2>
        <div className="history-cards">
          {patientHistory.length > 0 ? (
            patientHistory.map((record, index) => (
              <div key={index} className="history-card">
                <div className="card-header">
                  <span className="date">{record.treatment_date || 'N/A'}</span>
                </div>
                <div className="card-body">
                  <p><strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}</p>
                  <p><strong>Treatment:</strong> {record.treatment || 'N/A'}</p>
                  <p><strong>Notes:</strong> {record.notes || 'None'}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No previous medical history available</p>
          )}
        </div>
      </div>

      <div className="previous-prescriptions">
        <h2>Previous Prescriptions</h2>
        <div className="prescription-cards">
          {previousPrescriptions.length > 0 ? (
            previousPrescriptions.map((prescription, index) => (
              <div key={index} className="prescription-card">
                <div className="card-header">
                  <span className="date">{prescription.prescription_date || 'N/A'}</span>
                </div>
                <div className="card-body">
                  <p><strong>Notes:</strong> {prescription.notes || 'None'}</p>
                  {prescription.prescribed_medicines && prescription.prescribed_medicines.length > 0 ? (
                    <table className="medicine-table">
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.prescribed_medicines.map((medicine, midx) => (
                          <tr key={midx}>
                            <td>{medicine.medicine_name}</td>
                            <td>{medicine.dosage}</td>
                            <td>{medicine.frequency}</td>
                            <td>{medicine.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No medicines in this prescription</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No previous prescriptions available</p>
          )}
        </div>
      </div>

      <div className="dental-chart-section">
        <h2>Dental Chart</h2>
        <div className="dental-chart">
          <div className="upper-teeth dental-row">
            {teethStatus.slice(0, 16).map((status, index) => (
              <div
                key={index}
                className={`tooth ${status} ${selectedTooth === index ? 'selected' : ''}`}
                onClick={() => handleToothClick(index)}
              >
                <span className="tooth-number">{index + 1}</span>
                <div className="tooth-graphic">
                  <div className={`tooth-icon ${status || 'normal'}`}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="lower-teeth dental-row">
            {teethStatus.slice(16).map((status, index) => (
              <div
                key={index + 16}
                className={`tooth ${status} ${selectedTooth === (index + 16) ? 'selected' : ''}`}
                onClick={() => handleToothClick(index + 16)}
              >
                <div className="tooth-graphic">
                  <div className={`tooth-icon ${status || 'normal'}`}></div>
                </div>
                <span className="tooth-number">{index + 17}</span>
              </div>
            ))}
          </div>
        </div>
        {selectedTooth !== null && (
          <div className="tooth-actions">
            <p>Selected: Tooth #{selectedTooth + 1}</p>
            <select
              value={teethStatus[selectedTooth]}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="filling">Filling</option>
              <option value="extraction">Extraction Needed</option>
              <option value="missing">Missing</option>
              <option value="decay">Decay</option>
              <option value="crown">Crown</option>
              <option value="bridge">Bridge</option>
              <option value="implant">Implant</option>
            </select>
          </div>
        )}
      </div>

      <div className="current-appointment">
        <h2>Current Appointment Notes</h2>
        <textarea
          className="notes-textarea"
          value={currentNotes}
          onChange={(e) => setCurrentNotes(e.target.value)}
          placeholder="Enter notes for the current appointment..."
          rows={4}
        />
        
        <h3>Work To Be Done</h3>
        <textarea
          className="work-textarea"
          value={workToBeDone}
          onChange={(e) => setWorkToBeDone(e.target.value)}
          placeholder="Describe the dental work that needs to be done..."
          rows={3}
        />
      </div>

      <div className="new-prescription">
        <h2>New Prescription</h2>
        <div className="prescription-form">
          <div className="form-row">
            <div className="form-group">
              <label>Medicine</label>
              <select 
                value={selectedMedicine.id || selectedMedicine} 
                onChange={(e) => {
                  const selected = medicineList.find(m => m.id.toString() === e.target.value) || e.target.value;
                  setSelectedMedicine(selected);
                }}
              >
                <option value="">Select Medicine</option>
                {medicineList.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Dosage</label>
              <input 
                type="text" 
                value={dosage} 
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 500mg"
              />
            </div>
            <div className="form-group">
              <label>Frequency</label>
              <input 
                type="text" 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g., twice daily"
              />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input 
                type="text" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 7 days"
              />
            </div>
            <button className="add-medicine-btn" onClick={handleAddMedicine}>
              Add Medicine
            </button>
          </div>
        </div>

        {newPrescription.length > 0 && (
          <div className="prescription-preview">
            <h3>Prescription Preview</h3>
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {newPrescription.map((medicine, index) => (
                  <tr key={index}>
                    <td>{medicine.name}</td>
                    <td>{medicine.dosage}</td>
                    <td>{medicine.frequency}</td>
                    <td>{medicine.duration}</td>
                    <td>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveMedicine(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="appointment-actions">
        <button className="cancel-btn" onClick={() => navigate("/appointments")}>
          Cancel
        </button>
        <button 
          className="save-btn" 
          onClick={handleSaveAppointment}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Appointment Details"}
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetails;