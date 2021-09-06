# `kanda-weather`

Weather dashboard for the Kanda Hackathon.

## DEPRECATED

> V2 of the dClimate API is now deprecated and queued for removal in the next few weeks! V3 of the dClimate API can be found at api.dclimate.net/apiv3. Please note the API will require all users to register before accessing data. Register now using the registration endpoint at api.dclimate.net/apiv3/register.

Due to the deprecation of the v2 API, authorization is now required, so this application won't work anymore.

## Usage

First, run:

```sh
npm install && npm install parcel@2.0.0-beta.3.1
```

To build into the `dist/` directory, run:

```sh
npm run build
```

To start the server, run:

```sh
npm run start
```

To start a development server, run:

```sh
npm run dev
```

## Troubleshooting

I have zero idea why this happens (probably a bug on `npm`'s end),
but the CORS sent by `parcel` sometimes mess up because `npm`
installs `parcel@2.0.0-nightly.792` instead of `parcel@2.0.0-beta.3.1`.
If there are stylistic issues when loading
the webpage, try running:

```sh
npm install parcel@2.0.0-beta.3.1
```

This error doesn't occur in production, because the CORS problems do
not occur when hosting from other deployment platforms.

## Architecture

For more information on how this application was built, see the architecture
notes: [ARCHITECTURE.md](./ARCHITECTURE.md).
