const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();




const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to MongoDB
require("./config/database");

app.set("view engine", "ejs");

// Middleware to get the version from version.json
//app.use(require("config/versionMidleware.js"));

// Routes
app.use("/", require("./routes/index"));
app.use("/classrooms", require("./routes/classrooms"));
app.use("/dashboard", require("./routes/dashboard"));



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
