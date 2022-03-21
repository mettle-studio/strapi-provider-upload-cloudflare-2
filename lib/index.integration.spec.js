const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const extension = require('./index.js');
const exp = require('constants');

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_KEY = process.env.CLOUDFLARE_API_KEY;

describe('When a user uploads an image', () => {
  it('it is pushed to the cloudflare images api', async () => {
    const fileBuffer = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'test-image.png'));
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const file = {
      type: 'image/png',
      hash: hashSum.digest('hex'),
      ext: 'png',
      buffer: fileBuffer,
    };

    const uploadedFile = await extension
      .init({
        accountId: ACCOUNT_ID,
        apiKey: API_KEY,
      })
      .upload(file);

    expect(uploadedFile.url).toBeTruthy();
  });
});

describe('When a user uploads a video', () => {
  it ('it is pushed to the cloudflare streams api', async () => {
    const pathVar = path.resolve(__dirname, '..', 'assets', 'test-video.mp4');
    const fileBuffer = fs.readFileSync(pathVar);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const file = {
      type: 'video/mp4',
      hash: hashSum.digest('hex'),
      ext: 'mp4',
      buffer: fileBuffer,
    };

    const uploadedFile = await extension
      .init({
        accountId: ACCOUNT_ID,
        apiKey: API_KEY,
      })
      .upload(file, pathVar);

    console.log(uploadedFile);

    expect(uploadedFile.url).toBeTruthy();
  })
})

describe('When a user deletes a file', () => {
  it ('it deletes using id and file type appropriately', async () => {
    const public_id = '';//get public ID for testing
    const response = await extension
      .init({
        accountId: ACCOUNT_ID,
        apiKey: API_KEY,
      })
      .delete(public_id, 'video');
      expect(response['success']).toBeTruthy();
  })
})
