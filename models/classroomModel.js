//a simple model to a classroom object
const mongoose = require("mongoose");
const resourceSchema = require("./resourceModel");
const classroomSchema = new mongoose.Schema({
  courseName: String,
  location: String,
  semester: String,
  resources: [resourceSchema],
  features: [String],
  alerts_manutencao: [{ resource: String, descricao: String }],
});
const Classroom = mongoose.model("Classroom", classroomSchema);
module.exports = Classroom;
