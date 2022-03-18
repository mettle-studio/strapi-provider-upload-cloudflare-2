const extension = require('./index.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const uploadVideo = require('./uploadVideo.js');
const exp = require('constants');

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_KEY = process.env.CLOUDFLARE_API_KEY;

describe('uploadVideo', () => {
  it('pushes a file to the cloudflare video api', async () => {
    const vpath = path.resolve(__dirname, '..', 'assets', 'test-video.mp4');

    try {
      const response = await uploadVideo(vpath, ACCOUNT_ID, API_KEY)

      // update these expectations to be better
      console.log(response);
      expect(Object.is(response._response.statusMessage, 'Created'));
      expect(response._response.headers['stream-media-id']).toBeTruthy();//this why i messaged sam

    } catch (error) {
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

      throw error
    }
  });
});
