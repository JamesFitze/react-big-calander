import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, addHours } from "date-fns";
import enUS from "date-fns/locale/en-US";
import Modal from "react-modal";

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

const events = [
  {
    title: "Meeting",
    start: new Date(),
    end: new Date(),
  },
];

function App() {
  const [myEvents, setMyEvents] = useState(events);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const [selectedDate, setSelectedDate] = useState(null); // State to store selected date for the event
  const [eventTitle, setEventTitle] = useState(""); // State for event title
  const [startTime, setStartTime] = useState(""); // State for start time
  const [endTime, setEndTime] = useState(""); // State for end time
  const [currentEvent, setCurrentEvent] = useState(null); // State to store the current event being viewed or edited

  // Open the modal when a date is clicked
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start); // Store the selected date
    setStartTime(format(start, "yyyy-MM-dd'T'HH:mm")); // Set the default start time in the format
    setEndTime(format(addHours(start, 1), "yyyy-MM-dd'T'HH:mm")); // Set the default end time (1 hour after start)
    setCurrentEvent(null); // Reset current event for creating new event
    setModalIsOpen(true); // Open the modal
  };

  // Open the modal to view or edit an existing event
  const handleSelectEvent = (event) => {
    setCurrentEvent(event); // Store the event to view/edit
    setEventTitle(event.title); // Set the event title in the form
    setStartTime(format(event.start, "yyyy-MM-dd'T'HH:mm")); // Set the event start time in the form
    setEndTime(format(event.end, "yyyy-MM-dd'T'HH:mm")); // Set the event end time in the form
    setModalIsOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setEventTitle(""); // Reset the event title when closing the modal
    setStartTime(""); // Reset start time
    setEndTime(""); // Reset end time
    setCurrentEvent(null); // Reset the current event
  };

  // Handle the form submission for adding or editing an event
  const handleAddOrUpdateEvent = () => {
    if (eventTitle && startTime && endTime) {
      const newEvent = {
        title: eventTitle,
        start: new Date(startTime), // Parse the start time string as Date object
        end: new Date(endTime), // Parse the end time string as Date object
      };

      if (currentEvent) {
        // If editing an existing event, update the event
        const updatedEvents = myEvents.map((event) =>
          event === currentEvent ? newEvent : event
        );
        setMyEvents(updatedEvents);
      } else {
        // If creating a new event, add the event
        setMyEvents([...myEvents, newEvent]);
      }
      closeModal(); // Close the modal after adding or updating the event
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = () => {
    if (currentEvent) {
      const updatedEvents = myEvents.filter((event) => event !== currentEvent);
      setMyEvents(updatedEvents); // Remove the event from the state
      closeModal(); // Close the modal after deleting the event
    }
  };

  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>📅 React Big Calendar Demo</h1>
      <button
        onClick={() => setModalIsOpen(true)} // Open modal on button click
        style={{
          padding: "10px",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        Add Event
      </button>
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", margin: "20px" }}
        selectable={true} // Allow selecting a day
        onSelectSlot={handleSelectSlot} // Handle day selection
        onSelectEvent={handleSelectEvent} // Handle event selection
      />

      {/* Modal for adding or editing an event */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add or Edit Event"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay to cover the screen
            position: "fixed", // Ensure it covers the entire screen
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999, // Ensure it's above all other content
          },
          content: {
            position: "fixed", // Position the modal fixed on the screen
            top: "50%", // Center vertically
            left: "50%", // Center horizontally
            transform: "translate(-50%, -50%)", // Adjust for exact centering
            width: "400px", // Set a fixed width for the modal
            padding: "30px", // Increase the padding for a more spacious look
            background: "white",
            borderRadius: "10px",
            zIndex: 10000, // Ensure the modal content appears on top of the overlay
            boxSizing: "border-box", // Ensure the padding is included in the width
          },
        }}
      >
        <h2>{currentEvent ? "Edit Event" : "Add Event"}</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          style={{
            width: "100%", 
            padding: "10px", 
            marginBottom: "15px", 
            boxSizing: "border-box", // Prevent input from stretching
          }}
        />
        <div style={{ marginBottom: "15px" }}>
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              boxSizing: "border-box", // Prevent input from stretching
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              boxSizing: "border-box", // Prevent input from stretching
            }}
          />
        </div>
        <div>
          <button
            onClick={handleAddOrUpdateEvent}
            style={{
              padding: "10px",
              marginRight: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
            }}
          >
            {currentEvent ? "Update Event" : "Add Event"}
          </button>
          {currentEvent && (
            <button
              onClick={handleDeleteEvent}
              style={{
                padding: "10px",
                backgroundColor: "#f44336",
                color: "white",
                cursor: "pointer",
              }}
            >
              Delete Event
            </button>
          )}
          <button
            onClick={closeModal}
            style={{
              padding: "10px",
              backgroundColor: "#f44336",
              color: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
