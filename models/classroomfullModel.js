const mongoose = require("mongoose");

const classroomfullSchema = new mongoose.Schema({
  courseName: String,
  location: String,
  semester: String,
  resources: [{ name: String, available: Boolean }],
  features: [String],
  alerts_manutencao: [{ resource: String, descricao: String }],
});

const ClassroomFull = mongoose.model("Classroomfull", classroomfullSchema);

module.exports = ClassroomFull;
