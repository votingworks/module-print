import fonts from './fonts'

test('has the font we use', async () => {
  expect(fonts).toMatchObject({
    HelveticaNeue: {
      normal: [expect.any(String), 'HelveticaNeue'],
      bold: [expect.any(String), 'HelveticaNeue-Bold'],
      italics: [expect.any(String), 'HelveticaNeue-Italic'],
      bolditalics: [expect.any(String), 'HelveticaNeue-BoldItalic'],
    },
  })
})
