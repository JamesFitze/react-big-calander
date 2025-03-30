import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, addHours } from "date-fns";
import enUS from "date-fns/locale/en-US";
import Holidays from "date-holidays";
import Modal from "react-modal";
import "./App.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });



function App() {
  const [myEvents, setMyEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      return JSON.parse(savedEvents).map(event => ({
        ...event,
        start: new Date(event.start), // Convert back to Date object
        end: new Date(event.end) // Convert back to Date object
      }));
    }
    return [];
  });  


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [eventColor, setEventColor] = useState("#3174ad");
  
  useEffect(() => {
    const fetchHolidays = () => {
      const hd = new Holidays("CA");
      const holidays = hd.getHolidays(2025);
      const holidayEvents = holidays.map((holiday) => ({
        title: holiday.name,
        start: new Date(holiday.date),
        end: new Date(holiday.date),
        color: "#FF5733",
      }));
      setMyEvents(holidayEvents);
    };

    fetchHolidays();
  }, []);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setStartTime(format(start, "yyyy-MM-dd'T'HH:mm"));
    setEndTime(format(addHours(start, 1), "yyyy-MM-dd'T'HH:mm"));
    setCurrentEvent(null);
    setModalIsOpen(true);
  };

  const handleSelectEvent = (event) => {
    console.log("Selected Event:", event);
    setCurrentEvent(event);
    setEventTitle(event.title);
    setStartTime(format(event.start, "yyyy-MM-dd'T'HH:mm"));
    setEndTime(format(event.end, "yyyy-MM-dd'T'HH:mm"));
    setEventColor(event.color || "#3174ad");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEventTitle("");
    setStartTime("");
    setEndTime("");
    setEventColor("#3174ad");
    setCurrentEvent(null);
  };
  

  const validateEventTimes = (startTime, endTime) => {
    const now = new Date();
  
    if (new Date(startTime) < now) {
      return "Start time cannot be in the past.";
    }
  
    if (new Date(endTime) <= new Date(startTime)) {
      return "End time must be after the start time.";
    }
  
    return null; // No error
  };

  const handleAddOrUpdateEvent = () => {
    if (eventTitle && startTime && endTime) {
      // Validate the event times
      const validationError = validateEventTimes(startTime, endTime);
      if (validationError) {
        alert(validationError);
        return;
      }
  
      const newEvent = {
        title: eventTitle,
        start: new Date(startTime),
        end: new Date(endTime),
        color: eventColor,
      };
  
      if (currentEvent) {
        const updatedEvents = myEvents.map((event) =>
          event === currentEvent ? newEvent : event
        );
        setMyEvents(updatedEvents);
      } else {
        setMyEvents((prevEvents) => [...prevEvents, newEvent]);
      }
  
      closeModal();
    } else {
      console.log("Error: Missing required fields.");
    }
  };

  const handleDeleteEvent = () => {
    if (currentEvent) {
      const updatedEvents = myEvents.filter((event) => {
        return event.start !== currentEvent.start || event.title !== currentEvent.title;
      });
      setMyEvents(updatedEvents);
      closeModal();
    }
  };

  // Custom Toolbar component with Add Event button
  const CustomToolbar = ({ onNavigate, label, onAddEvent, onView }) => {
    return (
      <div className="rbc-toolbar">
        {/* Default toolbar elements */}
        <div className="rbc-toolbar-left">
        <button className="add-event-button" onClick={onAddEvent}>Add Event</button>
        <button onClick={() => onNavigate("PREV")}>Prev</button>
        <button onClick={() => onNavigate("NEXT")}>Next</button>
        </div>
        <span className="rbc-toolbar-label">{label}</span>
        <div className="rbc-toolbar-right">
        <button onClick={() => onView("month")}>Month</button>
        <button onClick={() => onView("week")}>Week</button>
        <button onClick={() => onView("day")}>Day</button>
        <button onClick={() => onView("agenda")}>Agenda</button>

        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        className="calendar"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
        toolbar={CustomToolbar}
        date={currentDate}
        view={currentView}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        onView={(newView) => setCurrentView(newView)}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color || "#3174ad",
            color: "white",
          },
        })}
        formats={{
          weekdayFormat: "eeee", // Full day name
        }}
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              onAddEvent={() => setModalIsOpen(true)} // Trigger modal on "Add Event" button click
            />
          ),
        }}
      />

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Add or Edit Event" ariaHideApp={false}>
        <h2>{currentEvent ? "Edit Event" : "Add Event"}</h2>

        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          className="modal-input"
        />

        <div>
          <label>Start Time</label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="modal-input" />
        </div>

        <div>
          <label>End Time</label>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="modal-input" />
        </div>

        <div>
          <label>Event Color</label>
          <input
            type="color"
            value={eventColor}
            onChange={(e) => setEventColor(e.target.value)}
            className="color-picker"
          />
        </div>

        <div>
          <button className="modal-button update-button" onClick={handleAddOrUpdateEvent}>
            {currentEvent ? "Update Event" : "Add Event"}
          </button>

          {currentEvent && (
            <button className="modal-button delete-button" onClick={handleDeleteEvent}>
              Delete Event
            </button>
          )}

          <button className="modal-button cancel-button" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
