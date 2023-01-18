"use strict";

const uploadVideo = require("./uploadVideo");
const uploadImage = require("./uploadImage");
const deleteFile = require("./deleteFile");
const clearTempFile = require("./clearTempFile");

const handleVideoResponse = (file, streamMediaId) => {
  file.url = `https://watch.videodelivery.net/${streamMediaId}`;
  file.preview_url = `https://videodelivery.net/${streamMediaId}/thumbnails/thumbnail.jpg`;
  file.provider_metadata = {
    public_id: streamMediaId,
    dash_url: `https://videodelivery.net/${streamMediaId}/manifest/video.mpd`,
    hls_url: `https://videodelivery.net/${streamMediaId}/manifest/video.m3u8`,
  };
  return file;
};

const handleImageResponse = (file, uploadImageResponse, variant) => {
  const result = uploadImageResponse.data.result;
  const filename = result.filename;
  const split = filename.split(".");
  const type = split.length > 0 ? split[split.length - 1] : "";
  file.url = result.variants.find((v) => v.includes("/" + variant));
  file.provider_metadata = {
    public_id: result.id,
    resource_type: type,
    variant_url: file.url.substr(0, file.url.lastIndexOf("/")),
  };
  return file;
};

module.exports = {
  init: (config) => {
    const accountId = config.accountId;
    const apiKey = config.apiKey;
    const variant = config.variant;
    return {
      upload: async (file) => {
        switch (file.mime.split("/")[0]) {
          case "video":
            try {
              const streamMediaId = await uploadVideo(file, accountId, apiKey);
              return handleVideoResponse(file, streamMediaId);
            } catch (e) {
              // strapi does not clear the temp file if an error is thrown
              clearTempFile();
              throw e;
            }
          case "image":
            try {
              const uploadImageResponse = await uploadImage(
                file,
                accountId,
                apiKey
              );
              return handleImageResponse(file, uploadImageResponse, variant);
            } catch (e) {
              // strapi does not clear the temp file if an error is thrown
              clearTempFile();
              throw e;
            }
          default:
            throw new Error("Unhandled File Type");
        }
      },
      uploadStream: async (file) => {
        switch (file.mime.split("/")[0]) {
          case "video":
            try {
              const streamMediaId = await uploadVideo(file, accountId, apiKey);
              return handleVideoResponse(file, streamMediaId);
            } catch (e) {
              // strapi does not clear the temp file if an error is thrown
              clearTempFile();
              throw e;
            }
          case "image":
            try {
              const uploadImageResponse = await uploadImage(
                file,
                accountId,
                apiKey
              );
              return handleImageResponse(file, uploadImageResponse, variant);
            } catch (e) {
              // strapi does not clear the temp file if an error is thrown
              clearTempFile();
              throw e;
            }
          default:
            throw new Error("Unhandled File Type");
        }
      },
      delete(file) {
        let delete_id = file.provider_metadata.public_id;
        let filetype = file.mime.split("/")[0];
        return deleteFile(delete_id, filetype, accountId, apiKey);
      },
    };
  },
};
