"use strict";

const fs = require("fs");

const clearTempFile = () => {
  const tmpDir = "/tmp/";
  fs.readdir(tmpDir, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }

    files.forEach((file) => {
      if (file.startsWith("upload_")) {
        const filePath = tmpDir + file;
        fs.unlinkSync(filePath);
      }
    });
  });
};

module.exports = clearTempFile;
