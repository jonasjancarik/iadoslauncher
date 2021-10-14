# IADOS Launcher

## Build Setup

``` bash
# install dependencies
yarn install

# serve app with hot reload
yarn run dev

# build electron application for production
yarn run build

# lint all JS/Vue component files in `src/`
yarn run lint

```

## Known issues
This is a very early version, so a lot of stuff is missing.

Anyway, here is a list of known issues which should be fixed as a matter of priority:

- Installing and running games is untested on macOS
- Settings values are not set to platform defaults until 'use default' is clicked in settings
- `-fullscreen` flag doesn't seem to work properly on Linux (Linux Mint 20.2) - game is not scaled; untested on macOS


## electron-nuxt

This project was generated with [electron-nuxt](https://github.com/michalzaq12/electron-nuxt) v1.7.1 using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://github.com/michalzaq12/electron-nuxt/blob/master/README.md).
