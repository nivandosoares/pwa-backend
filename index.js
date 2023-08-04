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

// API routes
app.get("/", async (req, res) => {
  try {
    const classrooms = await Classroom.find();
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
    res.json(deletedClassroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
