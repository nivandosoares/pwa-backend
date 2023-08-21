const express = require("express");
const router = express.Router();
const classroomsController = require("../controllers/classroomsController");

router.get("/json", classroomsController.getClassroomJson);
router.get("/", classroomsController.getAllClassrooms);
router.post("/", classroomsController.createClassroom);
router.put("/:id", classroomsController.updateClassroom);
router.delete("/:id", classroomsController.deleteClassroom);
router.get("/search", classroomsController.searchClassrooms);
router.get("/:classroomId", classroomsController.getClassroom);

module.exports = router;
