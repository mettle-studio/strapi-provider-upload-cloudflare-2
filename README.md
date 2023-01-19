# strapi-provider-upload-cloudflare-2

[![npm version](https://img.shields.io/npm/v/strapi-provider-upload-cloudflare-2.svg)](https://www.npmjs.org/package/strapi-provider-upload-cloudflare-2)
[![npm downloads](https://img.shields.io/npm/dm/strapi-provider-upload-cloudflare-2.svg)](https://www.npmjs.org/package/strapi-provider-upload-cloudflare-2)

**Non-Official** Cloudflare Images and Video Upload Provider for Strapi

This has only been tested with Strapi 4.

## Installation

```bash
# using yarn
yarn add strapi-provider-upload-cloudflare-2

# using npm
npm install strapi-provider-upload-cloudflare-2
```

## Configurations

Your configuration is passed down to the provider.

See the [using a provider](https://docs.strapi.io/developer-docs/latest/plugins/upload.html#using-a-provider) documentation for information on installing and using a provider. And see the [environment variables](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#environment-variables) for setting and using environment variables in your configs.

### Provider Configuration

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 'strapi-provider-upload-cloudflare-2',
      providerOptions: {
        accountId: env('STRAPI_UPLOAD_CLOUDFLARE_ACCOUNT_ID'),
        apiKey: env('STRAPI_UPLOAD_CLOUDFLARE_API_KEY'),
        variant: 'cms',
      },
    },
  },
  // ...
});
```

For the **variant** you can use one you have configured in Cloudflare Images. Or if not, can configure. In this example we used 'cms' as variant. [Creating variants of your image](https://developers.cloudflare.com/images/cloudflare-images/transform/resize-images/) is partly explained in the Cloudflare documentation. For this go to your Cloudflare Dash panel and click Images. Next click Variants. From that screen you can add a new variant. Please note that with the **Fit Scale Down** option your image size will keeps its original size as long as its not above the given width and height parameters.

### Environment configuration

In the Provider Configuration there are the accountId and apiKey. Those environment variables should be set in the .env file .
To find your Cloudflare accountId and apiKey, log into your Cloudflare dashboard and click "Images". On that page you should see "Account ID" under Developer Resources. For apiKey, if you click the "Use API" tab you'll see a [link next to "API Token" to generate an apiKey](https://dash.cloudflare.com/profile/api-tokens). Click **get started** at Create Custom Token and give your token a name e.g. 'Cloudflare images Strapi'. In the permissions section after **Account** select item choose "Cloudflare Images" with edit permission. Next add another one and after **Account** select item choose "Stream" with edit permission.

`./.env`

```env
STRAPI_UPLOAD_CLOUDFLARE_ACCOUNT_ID=<place your Cloudflare Account ID here>
STRAPI_UPLOAD_CLOUDFLARE_API_KEY=<place your Cloudflare apiKey here>
```

### Security Middleware Configuration

Due to the default settings in the Strapi Security Middleware you will need to modify the `contentSecurityPolicy` settings to properly see thumbnail previews in the Media Library. You should replace `strapi::security` string with the object bellow instead as explained in the [middleware configuration](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html#loading-order) documentation.

`./config/middlewares.js`

```js
module.exports = [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'imagedelivery.net'],
          'media-src': ["'self'", 'data:', 'blob:', 'imagedelivery.net'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
];
```
### Optional
By default Strapi comes with Responsive formats and provides large, medium and small sizes automatically which also will be uploaded to Cloudflare images. This will count through your Cloudflare images plan by the limit of the amount of images. Because the variants in cloudflare images comes included in the plan it is recommended to turn off the responsive formats. To turn this off open your Strapi admin dashboard and go to **settings** at global settings choose **Media Library**. In this screen you can turn off **Responsive friendly upload** and **Size optimization** since this is handled by Cloudflare images as well.
Please note Strapi still comes with a thumbnail image variant which is also uploaded automatically to Cloudflare images.

## Resources

- [LICENSE](LICENSE)

## Links

- [Strapi website](https://strapi.io/)
- [Strapi documentation](https://docs.strapi.io)
- [Strapi community on Discord](https://discord.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
- [Cloudflare Images documentation](https://developers.cloudflare.com/images/cloudflare-images/)
- [Cloudflare API token documentation](https://developers.cloudflare.com/api/tokens/)
