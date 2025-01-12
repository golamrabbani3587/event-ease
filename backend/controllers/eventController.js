const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const { name, date, location, maxAttendees } = req.body;

    const newEvent = new Event({
      name,
      date,
      location,
      maxAttendees,
      createdBy: req.user.id,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: "Failed to create event" });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { name, date, location, maxAttendees } = req.body;
    const { eventId } = req.params;

    let parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      const [day, month, year] = date
        .split("-")
        .map((num) => parseInt(num, 10));
      parsedDate = new Date(year, month - 1, day);
    }

    if (isNaN(parsedDate)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD" });
    }

    const event = await Event.findByIdAndUpdate(
      eventId,
      { name, date: parsedDate, location, maxAttendees },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    req.io.emit("event:registration", {
      eventName: event.name,
      userId: req.user.id,
      message: `This event updated: ${event.name}`,
    });
    res.status(200).json(event);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};
