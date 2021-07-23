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

I have zero idea why this happens (probably a bug on `parcel`'s end),
but the CORS sent by `parcel` sometimes mess up in different
operating systems and times. If there are stylistic issues when loading
the webpage, try running:

```sh
npm install parcel@2.0.0-beta.3.1
```

If that doesn't work try:

```sh
npm install parcel@2.0.0-beta.3
```
