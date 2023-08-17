const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const fs = require("fs");
const ClassroomFull = require("./models/classroomfullModel");

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

const version = process.env.APP_VERSION || "unknown";
const Classroom = mongoose.model("Classroom", classroomSchema);

app.get("/version", (req, res) => {
  res.send(version);
});

// Render the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// Define a route for the manage page
app.get("/manage", (req, res) => {
  res.sendFile(__dirname + "/public/manage.html");
});
// API routes
app.get("/classrooms", async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms); // Respond with JSON data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

app.post("/classrooms", async (req, res) => {
  try {
    const { courseName, semester, location } = req.body;
    const newClassroom = new Classroom({ courseName, semester, location });
    const savedClassroom = await newClassroom.save();
    res.status(201).json(savedClassroom); // Respond with JSON data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/classrooms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, semester, location } = req.body;
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      id,
      { courseName, semester, location },
      { new: true }
    );
    res.json(updatedClassroom); // Respond with JSON data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/classrooms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClassroom = await ClassroomFull.findByIdAndDelete(id);
    res.json(deletedClassroom); // Respond with JSON data
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
// Middleware to get the version from version.json
app.use((req, res, next) => {
  const versionPath = path.join(__dirname, "version.json");

  fs.readFile(versionPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading version file:", err);
    } else {
      const versionData = JSON.parse(data);
      res.locals.version = versionData.version;
    }
    next();
  });
});

// Dashboard route
app.get("/dashboard/overview", async (req, res) => {
  try {
    const totalClassrooms = await ClassroomFull.countDocuments();

    const availableResources = await ClassroomFull.aggregate([
      { $unwind: "$resources" },
      { $match: { "resources.available": true } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const resourcesInUse = await ClassroomFull.aggregate([
      { $unwind: "$resources" },
      { $match: { "resources.available": false } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const totalAlerts = await ClassroomFull.aggregate([
      { $unwind: "$alerts_manutencao" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const overviewData = {
      totalClassrooms,
      availableResources: availableResources.length
        ? availableResources[0].count
        : 0,
      resourcesInUse: resourcesInUse.length ? resourcesInUse[0].count : 0,
      totalAlerts: totalAlerts.length ? totalAlerts[0].count : 0,
    };

    res.json(overviewData);
  } catch (error) {
    console.error("Erro ao obter dados da visão geral:", error);
    res.status(500).json({ error: "Erro ao obter dados da visão geral" });
  }
});

//Available resources route

app.get("/dashboard/available-resources", async (req, res) => {
  try {
    const availableResources = await ClassroomFull.aggregate([
      { $unwind: "$resources" },
      { $match: { "resources.available": true } },
      { $group: { _id: "$resources.name", count: { $sum: 1 } } },
    ]);

    res.json(availableResources);
  } catch (error) {
    console.error("Erro ao obter dados dos recursos disponíveis:", error);
    res
      .status(500)
      .json({ error: "Erro ao obter dados dos recursos disponíveis" });
  }
});

app.get("/dashboard/alerts", async (req, res) => {
  try {
    const alerts = await ClassroomFull.aggregate([
      { $unwind: "$alerts_manutencao" },
      {
        $project: {
          _id: 0,
          resource: "$alerts_manutencao.resource",
          descricao: "$alerts_manutencao.descricao",
        },
      },
    ]);

    res.json(alerts);
  } catch (error) {
    console.error("Erro ao obter dados dos alertas de manutenção:", error);
    res
      .status(500)
      .json({ error: "Erro ao obter dados dos alertas de manutenção" });
  }
});

app.get("/dashboard/classrooms-resources", async (req, res) => {
  try {
    const classroomsResources = await ClassroomFull.find(
      {},
      "courseName location resources"
    );

    res.json(classroomsResources);
  } catch (error) {
    console.error("Erro ao obter dados das salas e recursos:", error);
    res.status(500).json({ error: "Erro ao obter dados das salas e recursos" });
  }
});

app.get("/dashboard/room-alerts", async (req, res) => {
  try {
    const roomAlerts = await ClassroomFull.find(
      { "alerts_manutencao.0": { $exists: true } },
      "courseName location alerts_manutencao"
    );

    res.json(roomAlerts);
  } catch (error) {
    console.error("Erro ao obter salas com alertas de manutenção:", error);
    res
      .status(500)
      .json({ error: "Erro ao obter salas com alertas de manutenção" });
  }
});

app.get("/dashboard/classrooms-history", async (req, res) => {
  try {
    const classroomsHistory = await ClassroomFull.aggregate([
      { $unwind: "$history" },
      {
        $group: {
          _id: "$_id",
          courseName: { $first: "$courseName" },
          location: { $first: "$location" },
          history: { $push: "$history" },
        },
      },
    ]);

    res.json(classroomsHistory);
  } catch (error) {
    console.error("Erro ao obter histórico de utilização das salas:", error);
    res
      .status(500)
      .json({ error: "Erro ao obter histórico de utilização das salas" });
  }
});

app.get("/dashboard/statistics", async (req, res) => {
  try {
    const avgResourcesPerRoom = await ClassroomFull.aggregate([
      { $match: { resources: { $exists: true } } }, // Filtra os documentos com o campo 'resources'
      { $project: { _id: 0, resourcesCount: { $size: "$resources" } } },
      { $group: { _id: null, avgResources: { $avg: "$resourcesCount" } } },
    ]);

    const avgOccupancyRate = await ClassroomFull.aggregate([
      { $unwind: "$history" },
      {
        $group: {
          _id: "$_id",
          totalUsage: { $sum: "$history.duration" },
          totalCapacity: { $first: "$capacity" },
        },
      },
      {
        $group: {
          _id: null,
          avgOccupancyRate: {
            $avg: { $divide: ["$totalUsage", "$totalCapacity"] },
          },
        },
      },
    ]);

    const statistics = {
      avgResourcesPerRoom: avgResourcesPerRoom.length
        ? avgResourcesPerRoom[0].avgResources
        : 0,
      avgOccupancyRate: avgOccupancyRate.length
        ? avgOccupancyRate[0].avgOccupancyRate
        : 0,
    };

    res.json(statistics);
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({ error: "Erro ao obter estatísticas" });
  }
});
//swagger route
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger-config");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
