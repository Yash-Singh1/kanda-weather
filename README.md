# `kanda-weather`

Weather dashboard for the Kanda Hackathon.

## Usage

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
