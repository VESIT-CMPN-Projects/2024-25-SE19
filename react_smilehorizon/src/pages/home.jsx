//eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
//eslint-disable-next-line no-unused-vars
import Calendar from "react-calendar";
import Greeting from "../components/greeting";
import "react-calendar/dist/Calendar.css";
import "./home.css"; // Import the new CSS file
import DashboardStats from "../components/dashboardstats";
//eslint-disable-next-line no-unused-vars
import Card from "@mui/material/Card";
//eslint-disable-next-line no-unused-vars
import CardContent from "@mui/material/CardContent";
//eslint-disable-next-line no-unused-vars
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  return (
    <>
      <Greeting />
      <DashboardStats />
    </>
  );
};

export default Home;
