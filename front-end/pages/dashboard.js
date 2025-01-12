import { useEffect, useState } from "react";
import { getUserEvents, deleteEvent, updateEvent } from "../services/api";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import Notification from "../components/Notification";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    maxAttendees: "",
  });

  const fetchEvents = async () => {
    try {
      const data = await getUserEvents();
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (error) {
      console.error("Error fetching user events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("event:registration", ({ message }) => {
      setNotification(message);
    });

    return () => socket.disconnect();
  }, []);

  const formatDate = (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = eventDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 365) return `In ${Math.floor(days / 365)} years`;
    if (days > 30) return `In ${Math.floor(days / 30)} months`;
    if (days > 1) return `In ${days} days`;
    if (days === 1) return "Tomorrow";
    if (hours > 0) return `In ${hours} hours`;
    if (minutes > 0) return `In ${minutes} minutes`;
    return "Today";
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event._id);
    setFormData({
      name: event.name,
      date: event.date,
      location: event.location,
      maxAttendees: event.maxAttendees,
    });
  };

  const handleUpdateEvent = async (eventId) => {
    try {
      await updateEvent(eventId, formData);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Navbar />
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Your Events</h1>
        <ul className="sm:rounded-md max-w-3xl mx-auto">
          {loading ? (
            <p className="text-center">Loading events...</p>
          ) : events.length > 0 ? (
            events.map((event) => (
              <li key={event._id}>
                {editingEvent === event._id ? (
                  <form
                    className="px-4 py-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateEvent(event._id);
                    }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date.split("T")[0]}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Max Attendees
                      </label>
                      <input
                        type="number"
                        name="maxAttendees"
                        value={formData.maxAttendees}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingEvent(null)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="px-4 py-5 sm:px-6">
                    <div className="bg-white p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg leading-6 font-medium text-yellow-500">
                          {event.name}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-yellow-500">
                          {event.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm font-medium text-yellow-500">
                          Starting: {formatDate(event.date)}
                        </p>
                        <p className="text-sm font-medium text-yellow-500">
                          Attendees: {event.attendees.length} /{" "}
                          {event.maxAttendees}
                        </p>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditClick(event)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="text-center">No events found.</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
