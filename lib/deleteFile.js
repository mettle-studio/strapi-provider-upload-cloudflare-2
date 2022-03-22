'use strict';

const axios = require('axios');

const deleteFile = (delete_id, filetype, accountId, apiKey) => {
  var type = '';
  switch (filetype) {
    case 'video':
      type = 'stream';
      break;
    case 'image':
      type = 'images/v1';
      break;
    default:
      throw new Error('Unhandled File Type');
  }
  return axios({
    method: 'DELETE',
    url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/${type}/${delete_id}`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }).catch((error) => {
    if (error.status === 404) {
      console.log(`Image not found on Cloudflare: ${error.message}`);
    } else {
      throw new Error(`Error with deleting on Cloudflare: ${error.message}`);
    }
  });
}

module.exports = deleteFile;
