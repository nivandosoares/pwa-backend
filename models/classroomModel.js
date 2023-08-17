//a simple model to a classroom object
const mongoose = require("mongoose");
const classroomSchema = new mongoose.Schema({
  courseName: String,
  location: String,
  semester: String,
  resources: [{ name: String, available: Boolean }],
  features: [String],
  alerts_manutencao: [{ resource: String, descricao: String }],
});
const Classroom = mongoose.model("Classroom", classroomSchema);
module.exports = Classroom;
