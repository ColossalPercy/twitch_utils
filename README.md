# Twitch Utils

Copyright (c) 2018 ColossalPercy

Licensed under MIT license, see [LICENSE](https://github.com/ColossalPercy/twitch_utils/blob/master/LICENSE).

# About

Twitch Utils adds useful utilities to [twitch.tv](https://www.twitch.tv), to improve the general experience.

Such utilities include:
* Adding mod actions to the mod card
* Adding a purge button for moderators in the mod icons
* Showing account creation and name history in all user cards
* Allowing aliases to be used in chat

For more information on these features and more, please refer to the [wiki](#).

# Issues

For any issues or suggestions, please post in the [Issues](https://github.com/ColossalPercy/twitch_utils/issues/new) section.

# Developers

To modify for personal use or to contribute to the development requires [node.js](https://nodejs.org/en/). Once installed, clone the repo to your computer.

Open a terminal in the root of the project (where `package.json` is located) and run `npm install` to install the project dependencies.

Run `npm start` to load the development server. This loads a webserver on port 3000 and watches for files changes, automatically updating the build file. To load the development script in the browser, enter `localStorage.tmtDev = true` into the browser console.

*Note: The browser plugin is still required in order to load the script into twitch.*

To compile the script for production run `npm run build` in the terminal.
