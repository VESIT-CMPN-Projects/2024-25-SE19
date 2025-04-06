import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import "./patientlist.css";

const API_URL = "http://127.0.0.1:8000/api/patients/"; // Update if necessary

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    first_name: "",
    last_name: "",
    age: "",
    contact_number: "",
    gender: "",
  });
  const [editingPatient, setEditingPatient] = useState(null); 
  const navigate = useNavigate(); // Initialize the navigation hook

  // Fetch patients from backend
  const fetchPatients = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: { search: searchTerm },
      });
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  // Add a new patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.first_name || !newPatient.age || !newPatient.contact_number || !newPatient.gender) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(API_URL, newPatient);
      setPatients([...patients, response.data]);
      setNewPatient({
        first_name: "",
        last_name: "",
        age: "",
        contact_number: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error adding patient:", error.response?.data || error.message);
    }
  };

  // Edit patient
  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setNewPatient({
      first_name: patient.first_name,
      last_name: patient.last_name || "",
      age: patient.age,
      contact_number: patient.contact_number,
      gender: patient.gender || "",
    });
  };

  // Update patient
  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    if (!newPatient.first_name || !newPatient.age || !newPatient.contact_number || !newPatient.gender) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.put(`${API_URL}${editingPatient.id}/`, newPatient);
      setPatients(
        patients.map((patient) =>
          patient.id === editingPatient.id
            ? { ...newPatient, id: editingPatient.id }
            : patient
        )
      );
      setEditingPatient(null);
      setNewPatient({
        first_name: "",
        last_name: "",
        age: "",
        contact_number: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error updating patient:", error.response?.data || error.message);
    }
  };

  // Delete patient
  const handleDeletePatient = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setPatients(patients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error("Error deleting patient:", error.response?.data || error.message);
    }
  };

  // Handle patient name click to navigate to details page
  const handlePatientNameClick = (patientId) => {
    navigate(`/patientdetails/${patientId}`); // Using path parameters instead of query parameters
  };

  // Filter patients by search term (first name + last name)
  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.first_name} ${patient.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-list-page">
      <h1>Patient List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Patient Form */}
      <form
        onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient}
        className="patient-form"
      >
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={newPatient.first_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={newPatient.last_name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newPatient.age}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          value={newPatient.contact_number}
          onChange={handleInputChange}
        />

        {/* Gender Dropdown */}
        <select
          name="gender"
          value={newPatient.gender}
          onChange={handleInputChange}
          className="gender-select"
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>

        <button type="submit">
          {editingPatient ? "Update Patient" : "Add Patient"}
        </button>
      </form>

      {/* Patient List */}
      <table className="patient-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length ? (
            filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td 
                  className="patient-name-cell"
                  onClick={() => handlePatientNameClick(patient.id)}
                >
                  <span className="patient-name-link">{patient.first_name}</span>
                </td>
                <td 
                  className="patient-name-cell"
                  onClick={() => handlePatientNameClick(patient.id)}
                >
                  <span className="patient-name-link">{patient.last_name}</span>
                </td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.contact_number}</td>
                <td>
                  <button
                    onClick={() => handleEditPatient(patient)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No patients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
