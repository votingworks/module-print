import locateChrome from './locateChrome'

test('returns without error', async () => {
  // We don't bother checking the value because it's just a more mockable
  // passthrough for chrome-location.
  await locateChrome()
})
