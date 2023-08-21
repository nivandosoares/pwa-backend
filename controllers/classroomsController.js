const Classroom = require("../models/classroomModel");

module.exports = {
  getClassroomJson: async (req, res) => {
    try {
      const classrooms = await Classroom.find();
      res.json(classrooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  getAllClassrooms: async (req, res) => {
    try {
      const classrooms = await Classroom.find();
      res.render("classrooms", {
        classrooms: classrooms,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  createClassroom: async (req, res) => {
    try {
      const { courseName, semester, location } = req.body;
      const newClassroom = new Classroom({ courseName, semester, location });
      const savedClassroom = await newClassroom.save();
      res.status(201).json(savedClassroom); // Respond with JSON data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  updateClassroom: async (req, res) => {
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
  },
  deleteClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedClassroom = await Classroom.findByIdAndDelete(id);
      res.json(deletedClassroom); // Respond with JSON data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  searchClassrooms: async (req, res) => {
    try {
      const queryPattern = req.query.q;
      const searchResults = await Classroom.find({
        $or: [
          { courseName: { $regex: new RegExp(queryPattern, "i") } },
          { semester: { $regex: new RegExp(queryPattern, "i") } },
          { location: { $regex: new RegExp(queryPattern, "i") } },
        ],
      });
      res.json(searchResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getClassroom: async (req, res) => {
    const classroomId = req.params.classroomId;
    try {
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) {
        return res.status(404).send("Sala não encontrada");
      }
      res.render("classroom", {
        room: classroom,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar sala");
    }
  },
};
