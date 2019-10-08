import FontCache, { System } from './FontCache'

test('loads fonts from a fonts directory', async () => {
  const system: System = {
    entries: jest.fn().mockResolvedValueOnce(['MyFont.ttc']),
    isFile: jest.fn().mockResolvedValueOnce(true),
  }

  const cache = new FontCache('/var/fonts', system)
  const fonts = await cache.getFonts()

  expect(fonts).toMatchObject({
    MyFont: {
      normal: ['/var/fonts/MyFont.ttc', 'MyFont'],
      bold: ['/var/fonts/MyFont.ttc', 'MyFont-Bold'],
      italics: ['/var/fonts/MyFont.ttc', 'MyFont-Italic'],
      bolditalics: ['/var/fonts/MyFont.ttc', 'MyFont-BoldItalic'],
    },
  })
})

test('ignores directories in the fonts directory', async () => {
  const system: System = {
    entries: jest.fn().mockResolvedValueOnce(['subdir']),
    isFile: jest.fn().mockResolvedValueOnce(false),
  }

  const cache = new FontCache('/var/fonts', system)
  const fonts = await cache.getFonts()

  expect(fonts).toEqual({})
})

test('fails to load unsupported file types', async () => {
  const system: System = {
    entries: jest.fn().mockResolvedValueOnce(['not-a-font.png']),
    isFile: jest.fn().mockResolvedValueOnce(true),
  }

  const cache = new FontCache('/var/fonts', system)

  expect(cache.getFonts()).rejects.toThrowError(
    'unknown font type (.png): /var/fonts/not-a-font.png'
  )
})
