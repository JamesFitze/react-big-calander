import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function App() {
  const [myEvents, setMyEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: null, end: null });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);

  // Handle navigation (Today, Next, Back buttons)
  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  // Handle view change (Month, Week, Day, Agenda)
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Handle clicking on a date
  const handleSelectSlot = ({ start }) => {
    setNewEvent({ title: "", start, end: start });
    setShowForm(true);
  };

  // Handle form submission (Add event)
  const handleAddEvent = () => {
    if (newEvent.title.trim() === "") return;
    setMyEvents([...myEvents, newEvent]);
    setShowForm(false);
    setNewEvent({ title: "", start: null, end: null });
  };

  // Handle cancel button (Close form)
  const handleCancel = () => {
    setShowForm(false);
    setNewEvent({ title: "", start: null, end: null });
  };

  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>React Calendar</h1>
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        date={currentDate} 
        onNavigate={handleNavigate} 
        view={currentView} 
        onView={handleViewChange}
        views={{ month: true, week: true, day: true, agenda: true }}
        style={{ height: "80%", margin: "20px" }}
      />

      {showForm && (
        <div style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
        }}>
          <h3>Add Event</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleAddEvent} style={{ padding: "5px 10px", background: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Add
            </button>
            <button onClick={handleCancel} style={{ padding: "5px 10px", background: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
