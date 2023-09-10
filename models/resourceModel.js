//a simple model for resources object
const mongoose = require("mongoose");
const resourceSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  available: Boolean,
});

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;
