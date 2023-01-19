"use strict";

const axios = require("axios");

const deleteFile = (delete_id, filetype, accountId, apiKey) => {
  var type = "";
  switch (filetype) {
    case "video":
      type = "stream";
      break;
    case "image":
      type = "images/v1";
      break;
    default:
      throw new Error("Unhandled File Type");
  }
  return axios({
    method: "DELETE",
    url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/${type}/${delete_id}`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
};

module.exports = deleteFile;
