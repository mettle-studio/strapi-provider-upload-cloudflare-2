'use strict';

const tus = require('tus-js-client');
const fs = require('fs');

const uploadVideo = (path, accountId, apiKey) => new Promise((resolve, reject) => {
  var file = fs.createReadStream(path);
  var size = fs.statSync(path).size;
  var options = {
    endpoint: `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    chunkSize: 50 * 1024 * 1024,
    resume: true,
    metadata: {
      name: path.substr(path.lastIndexOf('/')+1, path.Length), //WHY IS THIS SET TO FILENAME IN EXAMPLE - should be name to actually display in CF
      filetype: 'video/mp4',
      defaulttimestamppct: 0.5,
    },
    uploadSize: size,
    onError: reject,
    onAfterResponse: (req, res) => resolve(res)
  };
  var upload = new tus.Upload(file, options);
  upload.start();
});

module.exports = uploadVideo;
