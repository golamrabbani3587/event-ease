const Event = require("../models/Event");

exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ error: "Event is full" });
    }
    if (event.attendees.includes(req.user.id)) {
      return res
        .status(400)
        .json({ error: "You have already joined this event" });
    }
    event.attendees.push(req.user.id);
    await event.save();
    req.io.emit("event:registration", {
      eventName: event.name,
      userId: req.user.id,
      message: `User with ID ${req.user.id} has registered for the event: ${event.name}`,
    });

    if (event.attendees.length >= event.maxAttendees) {
      req.io.emit("event:registration", {
        eventName: event.name,
        message: `Event ${event.name} is full now`,
      });
    }

    res.status(200).json({ message: "Registered successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register for event" });
  }
};

exports.registeredEventOfUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const createdEvents = await Event.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .select("name date location maxAttendees attendees");

    res.status(200).json({ events: createdEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve created events" });
  }
};
