const path = require("path");
const fs = require("fs");

module.exports = (req, res, next) => {
  const versionPath = path.join(__dirname, "version.json");

  fs.readFile(versionPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading version file:", err);
    } else {
      const versionData = JSON.parse(data);
      res.locals.version = versionData.version;
    }
    next();
  });
};
