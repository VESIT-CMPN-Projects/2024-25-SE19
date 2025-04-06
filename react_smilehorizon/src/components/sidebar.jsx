import React from "react";
import { Link } from "react-router-dom";
import {
  House,
  PeopleFill,
  PersonLinesFill,
  Calendar,
} from "react-bootstrap-icons";
import "./sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-content">
        <ul>
          <li>
            <Link to="/">
              <House className="icon" />
              <span className="link-text">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/patientlist">
              <PeopleFill className="icon" />
              <span className="link-text">Patient List</span>
            </Link>
          </li>
          <li>
            <Link to="/patientdetails">
              <PersonLinesFill className="icon" />
              <span className="link-text">Patient Details</span>
            </Link>
          </li>
          <li>
            <Link to="/appointments">
              <Calendar className="icon" />
              <span className="link-text">Appointments</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="copyright">
        <span className="link-text">© 2025 Smile Horizon</span>
      </div>
    </nav>
  );
}

export default Sidebar;