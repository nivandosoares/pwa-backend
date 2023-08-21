const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/version", (req, res) => {
  res.send(res.locals.version);
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/manage", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/manage.html"));
});

module.exports = router;
