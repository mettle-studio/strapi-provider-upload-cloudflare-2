"use strict";

const tus = require("tus-js-client");

const uploadVideo = (file, accountId, apiKey) =>
  new Promise((resolve, reject) => {
    let size = 0;
    if (file.stream !== undefined) {
      const statSync = require("fs").statSync;
      try {
        const stat = statSync(file.stream.path);
        size = stat.size;
      } catch (e) {
        if (file.size !== undefined) {
          const chunkSize = 256 * 1024;
          const sizeInBytes = Math.round(file.size);
          size = Math.ceil(sizeInBytes / chunkSize) * chunkSize;
        }
        console.log("Trouble getting filesize");
        reject(e);
      }
    } else {
      size = Buffer.byteLength(file.buffer);
    }
    let fileType = file.type;
    if (fileType === undefined && file.mime !== undefined) {
      fileType = file.mime;
    }
    let mediaId = null;
    var options = {
      endpoint: `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      metadata: {
        name: file.name,
        filetype: fileType,
        defaulttimestamppct: 0.5,
      },
      chunkSize: 5 * 1024 * 1024,
      uploadSize: size,
      onProgress(bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      },
      onError: reject,
      onSuccess: () => {
        resolve(mediaId);
      },
      onAfterResponse: (req, res) => {
        // check if the response is a 201 Created
        if (res.getStatus() === 201) {
          // get the Location header
          mediaId = res.getHeader("stream-media-id");
        }

        if (res.getStatus() >= 400) {
          reject("Upload failed with status " + res.getStatus());
        }
      },
    };
    var upload = new tus.Upload(file.stream ?? file.buffer, options);
    upload.start();
  });

module.exports = uploadVideo;
