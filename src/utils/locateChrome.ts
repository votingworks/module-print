import chromeLocation = require('chrome-location')

/**
 * Returns the path to the Google Chrome binary.
 *
 * This exists primarily because `chrome-location` is weird and sets
 * `module.exports` to a string, which jest finds hard to mock.
 *
 * @todo Replace `chrome-location` with one that can find Chromium, like this: https://github.com/GoogleChrome/chrome-launcher/blob/448a1d484ddfdceb1c4d54e62c509949c4d78fa1/src/chrome-finder.ts
 */
export default async function locateChrome(): Promise<string> {
  return chromeLocation
}
