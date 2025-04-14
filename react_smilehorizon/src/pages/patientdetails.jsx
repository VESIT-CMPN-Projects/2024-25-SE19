import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./patientdetails.css";

// Update with your actual backend URL - make sure this points to your Django server
const API_URL = "http://localhost:8000/api/patients/";

const PatientDetails = () => {
  const { id } = useParams(); // Get ID from URL if present
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [teethStatus, setTeethStatus] = useState(Array(32).fill("normal"));
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [loading, setLoading] = useState(false);

  // Medical and treatment details
  const [prescription, setPrescription] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [pendingWork, setPendingWork] = useState("");
  const [postMedication, setPostMedication] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");

  // State for patient's related records
  const [medicalHistories, setMedicalHistories] = useState([]);
  const [medications, setMedications] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Effect to handle both direct navigation and search
  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        // If we have an ID from the URL, load that patient directly
        await fetchPatientDetails(id);
      } else if (searchTerm) {
        // If we have a search term, filter patients
        const filteredPatients = patients.filter((patient) =>
          `${patient.first_name} ${patient.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

        if (filteredPatients.length > 0) {
          await fetchPatientDetails(filteredPatients[0].id);
        } else {
          setSelectedPatient(null);
        }
      }
    };

    loadPatient();
  }, [id, searchTerm, patients]);

  // Fetch complete patient details including related data
  const fetchPatientDetails = async (patientId) => {
    try {
      setLoading(true);

      // Fetch basic patient data
      const response = await axios.get(`${API_URL}${patientId}/`);
      setSelectedPatient(response.data);

      // Fetch teeth status
      await fetchPatientTeethStatus(patientId);

      // Set existing medical histories and medications
      setMedicalHistories(response.data.medical_histories || []);
      setMedications(response.data.medications || []);
      setDocuments(response.data.documents || []);

      // Fetch prescriptions if not included in patient data
      if (!response.data.prescriptions) {
        try {
          const prescriptionsResponse = await axios.get(
            `http://localhost:8000/prescriptions/api/prescriptions/?patient=${patientId}`
          );

          // Sort prescriptions by date (newest first)
          const sortedPrescriptions = prescriptionsResponse.data.sort((a, b) => {
            return new Date(b.prescription_date) - new Date(a.prescription_date);
          });

          // Update patient object with prescriptions
          setSelectedPatient((prev) => ({
            ...prev,
            prescriptions: sortedPrescriptions,
          }));
        } catch (prescriptionsError) {
          console.error("Error fetching prescriptions:", prescriptionsError);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setLoading(false);
    }
  };

  // Add a function to fetch tooth status when patient is selected
  const fetchPatientTeethStatus = async (patientId) => {
    try {
      // Change the URL from tooth-status to tooth_status
      const response = await axios.get(
        `${API_URL}${patientId}/tooth_status/`
      );
      
      // Log the response to debug
      console.log("Tooth status response:", response.data);
      
      // Convert to array for tooth chart
      const teethData = Array(32).fill("normal");
      if (response.data && response.data.length) {
        response.data.forEach((tooth) => {
          teethData[tooth.tooth_number - 1] = tooth.status;
        });
      }

      setTeethStatus(teethData);
    } catch (error) {
      console.error("Error fetching teeth status:", error);
      // Continue without failing - default to normal teeth
    }
  };

  // Handle tooth selection
  const handleToothClick = (index) => {
    setSelectedTooth(index);
  };

  // Update tooth status
  const handleStatusChange = async (status) => {
    if (!selectedPatient) return;

    try {
      setLoading(true);
      const updatedTeethStatus = [...teethStatus];
      updatedTeethStatus[selectedTooth] = status;
      setTeethStatus(updatedTeethStatus);

      // Change to update_tooth_status
      await axios.post(
        `${API_URL}${selectedPatient.id}/update_tooth_status/`,
        {
          tooth_number: selectedTooth + 1,
          status: status,
          notes: `Status updated to ${status} on ${new Date().toLocaleDateString()}`,
        }
      );

      setLoading(false);
    } catch (error) {
      console.error("Error updating tooth status:", error);
      setLoading(false);
    }
  };

  // Handle submission of patient details
  const handleSubmit = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first!");
      return;
    }

    try {
      setLoading(true);

      // Update the patient record if existing conditions have changed
      if (currentMedications !== selectedPatient.existing_conditions) {
        await axios.patch(`${API_URL}${selectedPatient.id}/`, {
          existing_conditions:
            currentMedications || selectedPatient.existing_conditions,
        });
      }

      // If there's prescription data, create a prescription
      if (prescription || workDone || pendingWork || postMedication) {
        try {
          // Create prescription but don't include tooth data - it's stored in patient model
          const prescriptionData = {
            patient_id: selectedPatient.id,
            prescription: prescription,
            work_done: workDone,
            pending_work: pendingWork,
            post_medication: postMedication,
          };

          // Still reference the treated tooth in prescription, but status is stored separately
          if (selectedTooth !== null) {
            prescriptionData.treated_tooth_number = selectedTooth + 1;
            // No need to include tooth_status as it's already saved to patient model
          }

          // Create prescription
          const prescriptionResponse = await axios.post(
            "http://localhost:8000/prescriptions/api/prescriptions/create_from_treatment/",
            prescriptionData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log(
            "Prescription created successfully:",
            prescriptionResponse.data
          );

          // Reset form fields
          setPrescription("");
          setWorkDone("");
          setPendingWork("");
          setPostMedication("");
        } catch (prescriptionError) {
          console.error("Error creating prescription:", prescriptionError);
          console.error("Response data:", prescriptionError.response?.data);
          alert(
            `Failed to create prescription: ${
              prescriptionError.response?.data?.error || prescriptionError.message
            }`
          );
        }
      }

      alert("Patient details and treatment information updated successfully!");

      // Refresh patient details
      fetchPatientDetails(selectedPatient.id);
      setLoading(false);
    } catch (error) {
      console.error("Error updating patient details:", error);
      alert("Failed to update patient details. See console for details.");
      setLoading(false);
    }
  };

  // Add this useEffect to match heights
  useEffect(() => {
    const matchHeights = () => {
      const personalInfoEl = document.querySelector('.personal-info');
      const prescriptionSidebar = document.querySelector('.prescription-history-sidebar');
      
      if (personalInfoEl && prescriptionSidebar) {
        const infoHeight = personalInfoEl.offsetHeight;
        document.documentElement.style.setProperty('--personal-info-height', `${infoHeight}px`);
      }
    };
    
    // Match heights after render and when window resizes
    matchHeights();
    window.addEventListener('resize', matchHeights);
    
    return () => {
      window.removeEventListener('resize', matchHeights);
    };
  }, [selectedPatient]);

  // Show search only when no ID is provided in URL
  const renderSearchBar = () => {
    if (!id) {
      return (
        <div className="search-panel">
          <input
            type="text"
            placeholder="Search patient by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="patient-details-page">
      {loading && <div className="loading-overlay">Loading...</div>}

      {renderSearchBar()}

      {selectedPatient && (
        <div className="patient-details">
          <div className="info-prescription-container">
            {/* Personal Information */}
            <div className="personal-info">
              <h2>Personal Information</h2>
              <table className="patient-table">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </td>
                    <th>Age</th>
                    <td>{selectedPatient.age}</td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>
                      {selectedPatient.gender === "M"
                        ? "Male"
                        : selectedPatient.gender === "F"
                        ? "Female"
                        : "Other"}
                    </td>
                    <th>Contact</th>
                    <td>{selectedPatient.contact_number}</td>
                  </tr>
                  <tr>
                    <th>Blood Group</th>
                    <td colSpan="3">{selectedPatient.blood_group || "Not recorded"}</td>
                  </tr>
                  <tr>
                  </tr>
                  <tr>
                    <th>Conditions</th>
                    <td colSpan="3">
                      {selectedPatient.existing_conditions || "No existing conditions"}
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td colSpan="3">
                      <span
                        className={`status-badge ${selectedPatient.status.toLowerCase()}`}
                      >
                        {selectedPatient.status === "NEW"
                          ? "New Patient"
                          : selectedPatient.status === "ONGOING"
                          ? "Ongoing Treatment"
                          : selectedPatient.status === "COMPLETED"
                          ? "Treatment Completed"
                          : "Follow-up Required"}
                      </span>
                    </td>
                  </tr>

                  {/* New rows for prescription history from most recent prescription */}
                  {selectedPatient.prescriptions &&
                    selectedPatient.prescriptions.length > 0 && (
                      <>
                        <tr>
                          <th>Latest Prescription</th>
                          <td colSpan="3">
                            {selectedPatient.prescriptions[0].prescription ||
                              "No prescription details"}
                          </td>
                        </tr>
                        <tr>
                          <th>Work Done</th>
                          <td colSpan="3">
                            {selectedPatient.prescriptions[0].work_done ||
                              "No work recorded"}
                          </td>
                        </tr>
                        <tr>
                          <th>Pending Work</th>
                          <td colSpan="3">
                            {selectedPatient.prescriptions[0].pending_work ||
                              "No pending work"}
                          </td>
                        </tr>
                        <tr>
                          <th>Post-Treatment</th>
                          <td colSpan="3">
                            {selectedPatient.prescriptions[0].post_medication ||
                              "No post-treatment medication"}
                          </td>
                        </tr>
                      </>
                    )}
                </tbody>
              </table>
            </div>

            {/* Prescription History - moved to the right */}
            {selectedPatient.prescriptions && selectedPatient.prescriptions.length > 0 && (
              <div className="prescription-history-sidebar">
                <h2>Prescription History</h2>
                <div className="prescription-scroll-container">
                  {selectedPatient.prescriptions.map((prescription, index) => (
                    <div key={index} className="prescription-card">
                      <div className="card-header">
                        <h3>
                          Prescription on{" "}
                          {new Date(
                            prescription.prescription_date
                          ).toLocaleDateString()}
                        </h3>
                      </div>
                      <div className="card-body">
                        {prescription.prescription && (
                          <div className="prescription-item">
                            <h4>Prescription Details</h4>
                            <p>{prescription.prescription}</p>
                          </div>
                        )}

                        {prescription.work_done && (
                          <div className="prescription-item">
                            <h4>Work Performed</h4>
                            <p>{prescription.work_done}</p>
                          </div>
                        )}

                        {prescription.pending_work && (
                          <div className="prescription-item">
                            <h4>Pending Work</h4>
                            <p>{prescription.pending_work}</p>
                          </div>
                        )}

                        {prescription.post_medication && (
                          <div className="prescription-item">
                            <h4>Post-Treatment Medication</h4>
                            <p>{prescription.post_medication}</p>
                          </div>
                        )}

                        {prescription.treated_tooth_number && (
                          <div className="prescription-item">
                            <h4>Treated Tooth</h4>
                            <p>
                              Tooth #{prescription.treated_tooth_number} -
                              Status:{" "}
                              {prescription.tooth_status || "Not specified"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Medical history section */}
          {medicalHistories.length > 0 && (
            <div className="medical-history-section">
              <h2>Medical History</h2>
              <div className="history-cards">
                {medicalHistories.map((history, index) => (
                  <div key={index} className="history-card">
                    <div className="card-header">
                      <span className="date">
                        {new Date(history.diagnosis_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="card-body">
                      <p>
                        <strong>Condition:</strong> {history.condition}
                      </p>
                      <p>
                        <strong>Treatment:</strong> {history.treatment}
                      </p>
                      {history.notes && (
                        <p>
                          <strong>Notes:</strong> {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dental chart */}
          <div className="dental-chart">
            <h2>Dental Chart</h2>

            <div className="tooth-pair">
              {/* Upper Jaw - Single Row (1-16) */}
              <div className="dental-arch upper" data-arch="Upper Jaw">
                <div className="tooth-row">
                  {/* Right to Left (1-8) */}
                  {[7, 6, 5, 4, 3, 2, 1, 0].map((index) => (
                    <div
                      key={index}
                      className={`tooth ${teethStatus[index]}`}
                      data-number={index + 1}
                      onClick={() => handleToothClick(index)}
                    >
                      <img src="/teeth.png" alt={`Tooth ${index + 1}`} />
                      {/* <span className="tooth-number">{index + 1}</span> */}
                    </div>
                  ))}
                  {/* Left to Right (9-16) */}
                  {[15, 14, 13, 12, 11, 10, 9, 8].map((index) => (
                    <div
                      key={index}
                      className={`tooth ${teethStatus[index]}`}
                      data-number={15 - index + 1}
                      onClick={() => handleToothClick(index)}
                    >
                      <img src="/teeth.png" alt={`Tooth ${index + 1}`} />
                      {/* <span className="tooth-number">{index + 1}</span> */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lower Jaw - Single Row (17-32) */}
              <div className="dental-arch lower" data-arch="Lower Jaw">
                <div className="tooth-row">
                  {/* Right to Left (17-24) */}
                  {[23, 22, 21, 20, 19, 18, 17, 16].map((index) => (
                    <div
                      key={index}
                      className={`tooth ${teethStatus[index]}`}
                      data-number={32 - index + 1}
                      onClick={() => handleToothClick(index)}
                    >
                      <img src="/teeth.png" alt={`Tooth ${index + 1}`} />
                      {/* <span className="tooth-number">{index + 1}</span> */}
                    </div>
                  ))}
                  {/* Left to Right (25-32) */}
                  {[24, 25, 26, 27, 28, 29, 30, 31].map((index) => (
                    <div
                      key={index}
                      className={`tooth ${teethStatus[index]}`}
                      data-number={index + 1}
                      onClick={() => handleToothClick(index)}
                    >
                      <img src="/teeth.png" alt={`Tooth ${index + 1}`} />
                      {/* <span className="tooth-number">{index + 1}</span> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tooth status selector */}
          {selectedTooth !== null && (
            <div className="treatment-section">
              <div className="treatment-box">
                <h3>Tooth {selectedTooth + 1} Treatment</h3>
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={teethStatus[selectedTooth]}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="filling">Filling</option>
                  <option value="extraction">Extraction</option>
                  <option value="missing">Missing</option>
                  <option value="decay">Decay</option>
                  <option value="crown">Crown</option>
                  <option value="implant">Implant</option>
                </select>
              </div>
            </div>
          )}

          {/* Treatment and medications section */}
          <div className="treatment-notes-section">
            <h2>Treatment Notes</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Prescription</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Enter prescription details"
                />
              </div>

              <div className="form-group">
                <label>Work Done</label>
                <textarea
                  value={workDone}
                  onChange={(e) => setWorkDone(e.target.value)}
                  placeholder="Describe work performed"
                />
              </div>

              <div className="form-group">
                <label>Pending Work</label>
                <textarea
                  value={pendingWork}
                  onChange={(e) => setPendingWork(e.target.value)}
                  placeholder="Describe work that needs to be done"
                />
              </div>

              <div className="form-group">
                <label>Post-Treatment Medication</label>
                <textarea
                  value={postMedication}
                  onChange={(e) => setPostMedication(e.target.value)}
                  placeholder="Post-treatment medication details"
                />
              </div>

              <div className="form-group">
                <label>Current Medications</label>
                <textarea
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="Update current medications"
                />
              </div>
            </div>
          </div>

          {/* Current medications display */}
          {medications.length > 0 && (
            <div className="medications-section">
              <h2>Current Medications</h2>
              <div className="medication-cards">
                {medications
                  .filter((med) => med.status === "CURRENT")
                  .map((medication, index) => (
                    <div key={index} className="medication-card">
                      <h3>{medication.name}</h3>
                      <p>
                        <strong>Dosage:</strong> {medication.dosage}
                      </p>
                      <p>
                        <strong>Frequency:</strong> {medication.frequency}
                      </p>
                      <p>
                        <strong>Since:</strong>{" "}
                        {new Date(medication.prescribed_date).toLocaleDateString()}
                      </p>
                      {medication.notes && (
                        <p>
                          <strong>Notes:</strong> {medication.notes}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <button onClick={handleSubmit} className="submit-btn">
            Save Details
          </button>
        </div>
      )}

      {!selectedPatient && !loading && (
        <div className="no-selection">
          <p>Search for a patient above to view their details</p>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
