//a simple model to a classroom object
const mongoose = require("mongoose");
const classroomSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.Mixed, // Aceita qualquer tipo de valor
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});
const Classroom = mongoose.model("Classroom", classroomSchema);
module.exports = Classroom;
