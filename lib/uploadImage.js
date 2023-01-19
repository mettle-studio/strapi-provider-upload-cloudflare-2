"use strict";

const axios = require("axios");
const FormData = require("form-data");

const uploadImage = (file, accountId, apiKey) => {
  var data = new FormData();
  data.append("file", file.stream ?? file.buffer, `${file.hash}${file.ext}`);

  return axios({
    method: "POST",
    url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...data.getHeaders(),
    },
    data: data,
  });
};

module.exports = uploadImage;
