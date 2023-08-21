const express = require("express");
const router = express.Router();
const classroomsController = require("../controllers/classroomsController");

router.get("/", classroomsController.getAllClassrooms);
router.post("/", classroomsController.createClassroom);
router.put("/:id", classroomsController.updateClassroom);
router.delete("/:id", classroomsController.deleteClassroom);
router.get("/search", classroomsController.searchClassrooms);

router.get("/:roomId", classroomsController.getClassroom);

module.exports = router;
