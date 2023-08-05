//a simple route handler
const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroomController");
router.get("/", classroomController.classroom_list);
router.get("/:id", classroomController.classroom_detail);
router.post("/", classroomController.classroom_create);
router.put("/:id", classroomController.classroom_update);
router.delete("/:id", classroomController.classroom_delete);
router.get("/search", classroomController.classroom_search);
module.exports = router;
