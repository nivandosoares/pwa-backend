const express = require("express");
const router = express.Router();
const resourcesController = require("../controllers/resourcesController");

router.get("/json", resourcesController.getResourcesJson);
router.get("/", resourcesController.getAllResources);
router.post("/", resourcesController.createResources);
router.put("/:id", resourcesController.updateResources);
router.delete("/:id", resourcesController.deleteResources);
router.get("/search", resourcesController.deleteResources);
router.get("/:resourceId", resourcesController.getResources);

module.exports = router;
