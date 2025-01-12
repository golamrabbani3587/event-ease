import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { getEvents, joinEvent } from "../services/api";

const HomePage = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
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

  const handleJoinEvent = async (eventId) => {
    if (!isLoggedIn) {
      setAlert({
        message: "Please login to join the event.",
        type: "error",
      });
      setTimeout(() => setAlert(null), 3000);
    } else {
      try {
        const response = await joinEvent(eventId);
        setAlert({
          message: response.message,
          type: "success",
        });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({
          message: err.message,
          type: "error",
        });
        setTimeout(() => setAlert(null), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Alert message */}
      {alert && (
        <div
          className={`absolute top-4 right-4 p-4 rounded-md shadow-lg text-white ${
            alert.type === "success" ? "bg-yellow-500" : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Upcoming Events</h1>

        <ul className="bg-white shadow overflow-hidden sm:rounded-md max-w-3xl mx-auto">
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event._id} className="border-t border-gray-200">
                <div className="px-6 py-6 sm:px-8 transform transition-all hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
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
                      Attendees: {event.attendees.length} / {event.maxAttendees}
                    </p>
                    <button
                      onClick={() => handleJoinEvent(event._id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center col-span-4">Loading events...</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
