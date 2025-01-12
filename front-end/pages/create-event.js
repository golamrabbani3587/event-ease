import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { createEvent } from "../services/api";
import { useRouter } from "next/router";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [maxAttendees, setMaxAttendees] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventName || !eventDate || !eventLocation) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createEvent({
        name: eventName,
        date: eventDate,
        location: eventLocation,
        maxAttendees,
      });

      setEventName("");
      setEventDate("");
      setEventLocation("");
      setMaxAttendees(4);

      setAlert({ message: "Event created successfully!", type: "success" });

      setTimeout(() => {
        setAlert(null);
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      setError("Error creating event, please try again later.");

      setAlert({
        message: "Error creating event. Please try again.",
        type: "error",
      });

      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create Event</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700"
            >
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-medium text-gray-700"
            >
              Event Date
            </label>
            <input
              type="datetime-local"
              id="eventDate"
              name="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="eventLocation"
              className="block text-sm font-medium text-gray-700"
            >
              Event Location
            </label>
            <input
              type="text"
              id="eventLocation"
              name="eventLocation"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="maxAttendees"
              className="block text-sm font-medium text-gray-700"
            >
              Max Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              value={maxAttendees}
              onChange={(e) => setMaxAttendees(e.target.value)}
              min="1"
              max="100"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;
