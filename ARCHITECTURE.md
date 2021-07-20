# Architecture

This file tells a little bit more about the architecture of the application.

## Frameworks

This application is a weather dashboard built using React and making use of the
latest React Hooks feature provided by it. The state management is done using Redux.
It is styled with the help of bootstrap.

## Directory Structure

Here is the directory structure and a little bit about each folder.

```sh
/
|
|_______ src/                   # The main source
|          |
|          |_______ actions/    # Action creators for Redux
|          |
|          |_______ components/ # The components that are displayed in the application
|          |
|          |_______ data/       # Magic numbers, months, localization, coordinates, etc.
|          |
|          |_______ helpers/    # Helper functions to use date formats, process dClimate data, etc.
|          |
|          |_______ reducers/   # Reducers for Redux
|          |
|          |_______ styles/     # Main CSS and vendored styles
|
|_______ .proxyrc.js            # Middlewares for the API when hosting through Parcel
|
|_______ vercel.json            # Proxies for Vercel
```
