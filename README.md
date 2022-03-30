# strapi-provider-upload-cloudflare-2

[![npm version](https://img.shields.io/npm/v/strapi-provider-upload-cloudflare-2.svg)](https://www.npmjs.org/package/strapi-provider-upload-cloudflare-2)
[![npm downloads](https://img.shields.io/npm/dm/strapi-provider-upload-cloudflare-2.svg)](https://www.npmjs.org/package/strapi-provider-upload-cloudflare-2)

**Non-Official** Cloudflare Images and Video Upload Provider for Strapi

This has only been tested with Strapi 4.

To find your Cloudflare accountId and apiKey, log into Cloudflare and click "Images". On that page you should see "Account ID" under Developer Resources. For apiKey, if you click the "Use API" tab you'll see a link next to "API Token" to generate an apiKey. The only permissions that API Token needs are "Account.Cloudflare Images" and "Account.Cloudflare Streams".

You must specify which variant you choose using the config option variant, this will then find the variant with the set name. See below for an example in the example config.

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

To get your accountId and apiKey see the top of this README.

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

## Resources

- [LICENSE](LICENSE)

## Links

- [Strapi website](https://strapi.io/)
- [Strapi documentation](https://docs.strapi.io)
- [Strapi community on Discord](https://discord.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
