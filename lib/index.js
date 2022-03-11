'use strict';

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream');

module.exports = {
  init(config) {
    const accountId = config.accountId;
    const apiKey = config.apiKey;
    return {
      upload(file) {
        const stream = new Readable({
          read() {
            this.push(file.buffer);
            this.push(null);
          },
        });
        var data = new FormData();

        var type = '';
        switch (file.type.split('/')[0]) {
          case 'video':
            type = 'stream';
            break;
          case 'image':
            type = 'images';
            break;
          default:
            throw new Error('Unhandled File Type');
        }
        data.append('file', stream, `${file.hash}${file.ext}`);
        return axios({
          method: 'POST',
          url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/${type}/v1`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            ...data.getHeaders(),
          },
          data: data,
        })
          .then((response) => {
            const result = response.data.result;
            const filename = result.filename;
            const split = filename.split('.');
            const type = split.length > 0 ? split[split.length - 1] : '';
            file.url = result.variants[0];
            file.provider_metadata = {
              public_id: result.id,
              resource_type: type,
            };
            return file;
          })
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
      },
      delete(file) {
        var type = file.type == 'video' ? 'stream' : file.type == 'image' ? 'images' : 'Error'; //sets type for URL
        if (type == 'Error') {
          throw new Error('Unhandled File Type');
        }
        const { public_id } = file.provider_metadata;
        return axios({
          method: 'DELETE',
          url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/${type}/v1/${public_id}`,
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
      },
    };
  },
};
