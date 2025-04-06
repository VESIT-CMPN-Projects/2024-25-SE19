import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { FaUserMd } from "react-icons/fa";
import { FaCalendarCheck, FaClipboardList } from "react-icons/fa";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
//eslint-disable-next-line no-unused-vars
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
//eslint-disable-next-line no-unused-vars
import CheckIcon from "@mui/icons-material/Check";

// Add this helper function at the top of your component
const formatDateToIndian = (date) => {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const DashboardStats = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDateStats, setSelectedDateStats] = useState({
    treated: 0,
    upcoming: 0,
    followups: 0,
  });

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Simulate fetching stats for the selected date
    const today = new Date();
    if (newDate < today) {
      setSelectedDateStats({
        treated: Math.floor(Math.random() * 20),
        upcoming: Math.floor(Math.random() * 10),
        followups: Math.floor(Math.random() * 5),
      });
    } else {
      setSelectedDateStats({
        treated: 0,
        upcoming: Math.floor(Math.random() * 10),
        followups: 0,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Stat Cards */}
      <h1 className="greeting__title !text-3xl md:text-5xl font-serif font-bold text-gray-800 ">
        Today's Statistics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-white p-6 rounded-xl shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105">
          {/* Left Colored Edge */}
          <div className="absolute top-0 left-0 w-3 h-full bg-blue-400 rounded-l-xl"></div>

          {/* Icon */}
          <FaUserMd className="text-blue-500 text-4xl mb-4 ml-4" />

          {/* Title */}
          <h2 className="text-xl font-semibold mb-2 ml-4 font-serif">
            Patients Treated
          </h2>

          {/* Number */}
          <p className="text-3xl font-bold text-blue-600 ml-4">43</p>

          {/* View Details Button */}
          <button className="absolute bottom-4 right-4 text-blue-500 hover:underline text-sm">
            View Details
          </button>
        </div>
        {/* Upcoming Appointments Card */}
        <div className="relative bg-white p-6 rounded-xl shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 overflow-hidden">
          {/* Solid Color Strip on the Left */}
          <div className="absolute top-0 left-0 w-3 h-full bg-green-400 rounded-l-xl"></div>

          {/* Icon on Top */}
          <FaCalendarCheck className="text-green-500 text-4xl mb-4 ml-4" />

          {/* Heading */}
          <h2 className="text-xl font-semibold mb-2 ml-4 font-serif">
            Upcoming Appointments
          </h2>

          {/* Count */}
          <p className="text-3xl font-bold text-green-600 ml-4">12</p>

          {/* View Details Button */}
          <button className="absolute bottom-4 right-4 text-blue-500 hover:underline text-sm">
            View Details
          </button>
        </div>

        {/* Pending Follow-ups Card */}
        <div className="relative bg-white p-6 rounded-xl shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 overflow-hidden">
          {/* Solid Color Strip on the Left */}
          <div className="absolute top-0 left-0 w-3 h-full bg-red-400 rounded-l-xl"></div>

          {/* Icon on Top */}
          <FaClipboardList className="text-red-500 text-4xl mb-4 ml-4" />

          {/* Heading */}
          <h2 className="text-xl font-semibold mb-2 ml-4 font-serif">
            Pending Follow-ups
          </h2>

          {/* Count */}
          <p className="text-3xl font-bold text-red-600 ml-4">14</p>

          {/* View Details Button */}
          <button className="absolute bottom-4 right-4 text-blue-500 hover:underline text-sm">
            View Details
          </button>
        </div>
      </div>

      {/* Calendar Below */}

      <div
        id="calendarSection calendar-stats"
        className="mt-10 bg-white p-6 rounded-xl shadow-md"
      >
        <h1 className="greeting__title !text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-6">
          Schedule Calendar
        </h1>
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="custom-calendar rounded-lg overflow-hidden md:w-[60%]">
            <Calendar
              onChange={handleDateChange}
              value={date}
              minDetail="month"
              maxDetail="month"
              showNeighboringMonth={false}
              className="w-full"
            />
          </div>

          {/* Calendar Stats */}
          <Card
            className="calendar-stats md:w-[35%]"
            sx={{ bgcolor: "#f3f4f6" }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  borderBottom: "2px solid #e5e7eb",
                  paddingBottom: "0.5rem",
                }}
              >
                Stats for {formatDateToIndian(date)}
              </Typography>

              <Box sx={{ mt: 3 }}>
                {/* Patients Treated - Blue Theme */}
                <Alert
                  icon={<FaUserMd />}
                  severity="info"
                  sx={{ mb: 2, "& .MuiAlert-message": { width: "100%" } }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Patients Treated
                  </Typography>
                  <Typography
                    variant="h4"
                    color="primary.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    {selectedDateStats.treated}
                  </Typography>
                </Alert>

                {/* Upcoming Appointments - Green Theme */}
                <Alert
                  icon={<FaCalendarCheck />}
                  severity="success"
                  sx={{ mb: 2, "& .MuiAlert-message": { width: "100%" } }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Upcoming Appointments
                  </Typography>
                  <Typography
                    variant="h4"
                    color="success.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    {selectedDateStats.upcoming}
                  </Typography>
                </Alert>

                {/* Pending Follow-ups - Red Theme */}
                <Alert
                  icon={<FaClipboardList />}
                  severity="error"
                  sx={{ "& .MuiAlert-message": { width: "100%" } }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Follow-ups
                  </Typography>
                  <Typography
                    variant="h4"
                    color="error.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    {selectedDateStats.followups}
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
