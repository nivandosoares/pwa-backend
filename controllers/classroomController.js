//a simple controller to a classroom object
const Classroom = require("../models/classroomModel");
exports.classroom_list = async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.json(classrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
}
exports.classroom_detail = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        res.json(classroom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
}
exports.classroom_create = async (req, res) => {
    try {
        const classroom = new Classroom({
            courseName: req.body.courseName,
            semester: req.body.semester,
            location: req.body.location,
        });
        const newClassroom = await classroom.save();
        res.json(newClassroom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
}
exports.classroom_update = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        classroom.courseName = req.body.courseName;
        classroom.semester = req.body.semester;
        classroom.location = req.body.location;
        const updatedClassroom = await classroom.save();
        res.json(updatedClassroom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
}       
exports.classroom_delete = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        const deletedClassroom = await classroom.remove();
        res.json(deletedClassroom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
}
exports.classroom_search = async (req, res) => {
    try {
        const query = req.query.q; // Get the search query from the request query parameters
        const searchResults = await Classroom.find({
            $or: [
                { courseName: { $regex: query, $options: "i" } }, // Case-insensitive search for courseName
                { semester: { $regex: query, $options: "i" } }, // Case-insensitive search for semester
                { location: { $regex: query, $options: "i" } }, // Case-insensitive search for location
            ],
        });
        res.json(searchResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
}
