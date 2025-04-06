import "./greeting.css";
import Button from "@mui/material/Button";
import Spline from "@splinetool/react-spline";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "morning";
  } else if (hour < 17) {
    return "afternoon";
  } else {
    return "evening";
  }
};

const Greeting = () => {
  const greeting = getGreeting(); // Get the appropriate greeting based on the time

  const scrollToCalendar = () => {
    const calendarSection = document.querySelector(".calendar-stats");
    if (calendarSection) {
      // Using smooth scroll with offset to account for any fixed headers
      window.scrollTo({
        top: calendarSection.offsetTop - 20, // 20px offset from top
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="greeting-container">
      <div className="spline-background">
        <Spline scene="https://prod.spline.design/oa1MbS-PJCIXlPtw/scene.splinecode" />
      </div>
      <div className="greeting-content z-10">
        <div className="greeting-box">
          <h1 className="greeting__title !text-6xl md:text-5xl font-serif font-bold text-gray-800 text-center pt-5">
            Good {greeting},
          </h1>
          <h1 className="greeting__title !text-6xl md:text-5xl font-serif font-bold text-gray-800 text-center mt-2">
            Dr. Samidha
          </h1>
        </div>
        <div className="greeting__button text-center p-5">
          <Button
            variant="outlined"
            onClick={scrollToCalendar}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            View Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
