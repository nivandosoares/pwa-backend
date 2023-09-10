//a simple model for resources object
const mongoose = require("mongoose");
const resourceSchema = new mongoose.Schema({
  name: String,
  available: Boolean,
  quantity: Number,
});

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;
