const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { setupSocket } = require("./utils/socket");
const mongoose = require("./config/db");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const server = require("http").createServer(app);
const io = setupSocket(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
