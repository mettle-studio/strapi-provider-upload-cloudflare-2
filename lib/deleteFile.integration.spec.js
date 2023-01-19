const extension = require("./index.js");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();
const deleteFile = require("./deleteFile.js");
const uploadImage = require("./uploadImage.js");
const uploadVideo = require("./uploadVideo.js");

var deleteid = "";
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_KEY = process.env.CLOUDFLARE_API_KEY;

describe("deleteImage", () => {
  beforeEach(async () => {
    const fileBuffer = fs.readFileSync(
      path.resolve(__dirname, "..", "assets", "test-image.png")
    );
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    const file = {
      type: "image/png",
      hash: hashSum.digest("hex"),
      ext: "png",
      buffer: fileBuffer,
    };
    const response = await uploadImage(file, ACCOUNT_ID, API_KEY);

    deleteID = response.data.result.id;
  });

  it("deletes a image using unique id and type", async () => {
    const response = await deleteFile(deleteID, "image", ACCOUNT_ID, API_KEY);
    expect(response.statusText).toBeTruthy();
  });
});

describe("deleteVideo", () => {
  beforeEach(async () => {
    const fileBuffer = fs.readFileSync(
      path.resolve(__dirname, "..", "assets", "test-video.mp4")
    );
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    const file = {
      type: "video/mp4",
      hash: hashSum.digest("hex"),
      ext: "mp4",
      buffer: fileBuffer,
    };
    deleteID = await uploadVideo(file, ACCOUNT_ID, API_KEY);
  });

  it("deletes a video using unique id and type", async () => {
    const response = await deleteFile(deleteID, "video", ACCOUNT_ID, API_KEY);
    expect(response.statusText).toBeTruthy();
  });
});
