'use strict';

const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream');

const uploadImage = (file, accountId, apiKey) => {
  const stream = new Readable({
    read() {
      this.push(file.buffer);
      this.push(null);
    },
  });
  var data = new FormData();
  data.append('file', stream, `${file.hash}${file.ext}`);

  return axios({
    method: 'POST',
    url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...data.getHeaders(),
    },
    data: data,
  });
};

module.exports = uploadImage;
