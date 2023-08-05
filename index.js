const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the Classroom schema
const classroomSchema = new mongoose.Schema({
  courseName: String,
  semester: String,
  location: String,
});

const Classroom = mongoose.model("Classroom", classroomSchema);

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1646819",
  key: "b95f2cce2e835c34e89f",
  secret: "881c75b4fd8e21a54379",
  cluster: "mt1",
  useTLS: true,
});
// Render the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// API routes
app.get("/", async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    pusher.trigger("my-channel", "classroom-listed", {
      message: "hello world from GET request",
      classrooms,
    });
    res.json(classrooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

// Add a new classroom
app.post("/", async (req, res) => {
  try {
    const { courseName, semester, location } = req.body;
    const newClassroom = new Classroom({ courseName, semester, location });
    const savedClassroom = await newClassroom.save();

    // Enviar notificação para o canal "my-channel" e channelo "classroom-created"
    pusher.trigger(
      "my-channel",
      "classroom-created",
      { message: "new data added:" },
      savedClassroom
    );

    res.status(201).json(savedClassroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an existing classroom
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, semester, location } = req.body;
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      id,
      { courseName, semester, location },
      { new: true }
    );

    // Enviar notificação para o canal "my-channel" e channelo "classroom-updated"
    pusher.trigger("my-channel", "classroom-updated", updatedClassroom);

    res.json(updatedClassroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an existing classroom
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClassroom = await Classroom.findByIdAndDelete(id);

    // Enviar notificação para o canal "my-channel" e channelo "classroom-deleted"

    res.json(deletedClassroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q; // Get the search query from the request query parameters
    const searchResults = await Classroom.find({
      $or: [
        { courseName: { $regex: query, $options: "i" } },
        { semester: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
    });
    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world",
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
