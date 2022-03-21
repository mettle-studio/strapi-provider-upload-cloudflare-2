'use strict';

const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream');

const uploadVideo = require("./uploadVideo");
const uploadImage = require("./uploadImage");

module.exports = {
  init: (config) => {
    const accountId = config.accountId;
    const apiKey = config.apiKey;
    return {
      upload: async (file) => {
        switch (file.type.split('/')[0]) {
          case 'video':
            const uploadVideoResponse = await uploadVideo(file, accountId, apiKey);
            const vresult = uploadVideoResponse;
            file.url = 'https://watch.cloudflarestream.com/'+vresult._response.headers['stream-media-id'];
            file.provider_metadata = {
              public_id: vresult._response.headers['stream-media-id'],
              hls_url: 'https://videodelivery.net/'+vresult._response.headers['stream-media-id']+'/manifest/video.m3u8w',
              dash_url: 'https://videodelivery.net/'+vresult._response.headers['stream-media-id']+'/manifest/video.mpd',
            };
            return file
          case 'image':
            const uploadImageResponse = await uploadImage(file, accountId, apiKey);
            const result = uploadImageResponse.data.result;
            const filename = result.filename;
            const split = filename.split('.');
            const type = split.length > 0 ? split[split.length - 1] : '';
            file.url = result.variants.find(variant => variant.endsWith('/cms'));
            file.provider_metadata = {
              public_id: result.id,
              resource_type: type,
              variant_url: file.url.substr(0, file.url.lastIndexOf('/'))
            };
            return file
          default:
            throw new Error('Unhandled File Type');
        }
      },
      delete(delete_id, filetype) {
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
      },
    };
  },
};
