'use strict';



const uploadVideo = require("./uploadVideo");
const uploadImage = require("./uploadImage");
const deleteFile = require("./deleteFile");

module.exports = {
  init: (config) => {
    const accountId = config.accountId;
    const apiKey = config.apiKey;
    const variant = config.variant;
    return {
      upload: async (file) => {
        switch (file.type.split('/')[0]) {
          case 'video':
            const uploadVideoResponse = await uploadVideo(file, accountId, apiKey);
            const vresult = uploadVideoResponse;
            file.url = 'https://watch.cloudflarestream.com/'+vresult._response.headers['stream-media-id'];
            file.preview_url = 'https://videodelivery.net/'+vresult._response.headers['stream-media-id']+'/thumbnails/thumbnail.jpg';
            file.dash_url = 'https://videodelivery.net/'+vresult._response.headers['stream-media-id']+'/manifest/video.mpd';
            file.hls_url = 'https://videodelivery.net/'+vresult._response.headers['stream-media-id']+'/manifest/video.m3u8w';
            file.provider_metadata = {
              public_id: vresult._response.headers['stream-media-id'],
            };
            return file
          case 'image':
            const uploadImageResponse = await uploadImage(file, accountId, apiKey);
            const result = uploadImageResponse.data.result;
            const filename = result.filename;
            const split = filename.split('.');
            const type = split.length > 0 ? split[split.length - 1] : '';
            file.url = result.variants.find(variant => variant.endsWith('/' + variant));
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
        return deleteFile(delete_id, filetype, accountId, apiKey);
      },
    };
  },
};
