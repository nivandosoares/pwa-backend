const Resources = require("../models/resourceModel");

module.exports = {
  getResourcesJson: async (req, res) => {
    try {
      const resources = await Resources.find();
      res.json(resources);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  getAllResources: async (req, res) => {
    try {
      const ResourceList = await Resources.find();
      res.render("resources", {
        resources: ResourceList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  createResources: async (req, res) => {
    try {
      const { name, available, quantity } = req.body;
      const newResources = new Resources({ name, available, quantity });
      const savedResources = await newResources.save();
      res.status(201).json(savedResources); // Respond with JSON data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  updateResources: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, available, quantity } = req.body;
      const updatedResources = await Resources.findByIdAndUpdate(
        id,
        { name, available, quantity },
        { new: true }
      );
      res.json(updatedResources); // Respond with JSON data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  deleteResources: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedResources = await Resources.findByIdAndDelete(id);
      res.json(deletedResources); // Respond with JSON data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  searchResources: async (req, res) => {
    try {
      const queryPattern = req.query.q;
      const searchResults = await Resources.find({
        $or: [
          { name: { $regex: new RegExp(queryPattern, "i") } },
          { available: { $regex: new RegExp(queryPattern, "i") } },
          { quantity: { $regex: new RegExp(queryPattern, "i") } },
        ],
      });
      res.json(searchResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getResources: async (req, res) => {
    const ResourcesId = req.params.ResourcesId;
    try {
      const resource = await Resources.findById(ResourcesId);
      if (!resource) {
        return res.status(404).send("Recurso não encontrado");
      }
      res.render("resource", {
        resource: resource,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar Recurso");
    }
  },
};
