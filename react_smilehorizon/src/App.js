import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import PatientList from "./pages/patientlist";
import PatientDetails from "./pages/patientdetails";
import Appointments from "./pages/appointments";
import AppointmentDetails from "./pages/apmt_details";
import Home from "./pages/home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patientlist" element={<PatientList />} />
            <Route path="/patientdetails/:id" element={<PatientDetails />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointment/:id" element={<AppointmentDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
