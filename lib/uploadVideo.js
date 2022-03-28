'use strict';

const tus = require('tus-js-client');
const fs = require('fs');
const { Readable } = require('stream');

const uploadVideo = (file, accountId, apiKey) => new Promise((resolve, reject) => {
  const stream = new Readable({
    read() {
      this.push(file.buffer);
      this.push(null);
    },
  });
  var size = Buffer.byteLength(file.buffer);
  var options = {
    endpoint: `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    chunkSize: 50 * 1024 * 1024,
    resume: true,
    metadata: {
      name: file.name,
      filetype: file.type,
      defaulttimestamppct: 0.5,
    },
    uploadSize: size,
    onError: reject,
    onAfterResponse: (req, res) => resolve(res)
  };
  var upload = new tus.Upload(stream, options);
  upload.start();
});

module.exports = uploadVideo;
