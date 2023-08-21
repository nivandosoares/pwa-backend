const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/overview", dashboardController.getOverview);
router.get("/available-resources", dashboardController.getAvailableResources);
router.get("/alerts", dashboardController.getAlerts);
router.get("/classrooms-resources", dashboardController.getClassroomsResources);
router.get("/room-alerts", dashboardController.getRoomAlerts);
router.get("/classrooms-history", dashboardController.getClassroomsHistory);
router.get("/statistics", dashboardController.getStatistics);

module.exports = router;
