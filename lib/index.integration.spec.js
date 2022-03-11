const extension = require('./index.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

    console.log(uploadedFile);

    expect(uploadedFile.url).toBeTruthy();
  });
});
