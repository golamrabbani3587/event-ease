const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const {
  registerForEvent,
  registeredEventOfUser,
} = require("../controllers/attendeeController");

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", getAllEvents);
router.put("/:eventId", protect, updateEvent);
router.delete("/:eventId", protect, deleteEvent);

router.get("/user", protect, registeredEventOfUser);
router.post("/:id/register", protect, registerForEvent);

module.exports = router;
