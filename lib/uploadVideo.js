"use strict";

const tus = require("tus-js-client");

const uploadVideo = (file, accountId, apiKey) =>
  new Promise((resolve, reject) => {
    let size = 0;
    if (file.stream !== undefined) {
      //using this instead of file.size because file.size might not be 100% accurate (it is in kb)
      const statSync = require("fs").statSync;
      const stat = statSync(file.stream.path);
      size = stat.size;
    } else {
      size = Buffer.byteLength(file.buffer);
    }

    let mediaId = null;
    var options = {
      endpoint: `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      metadata: {
        name: file.name,
        filetype: file.type,
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
