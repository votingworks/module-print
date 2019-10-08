/**
 * References fonts to be made available to pdfmake.
 *
 * This file is intentionally simplistic. We only have one font right now, so
 * there's not much point in making it more complex.
 */

import { join } from 'path'

/**
 * HelveticaNeue.ttc is a True Type Collection, meaning it is a bundle of
 * True Type Fonts. pdfmake can parse True Type Collections as long as we tell
 * it the name and path of each font variant.
 *
 * @see https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/
 */
const HelveticaNeueFontCollectionPath = join(
  __dirname,
  '..',
  '..',
  'fonts',
  'HelveticaNeue.ttc'
)

export default {
  HelveticaNeue: {
    normal: [HelveticaNeueFontCollectionPath, 'HelveticaNeue'],
    bold: [HelveticaNeueFontCollectionPath, 'HelveticaNeue-Bold'],
    italics: [HelveticaNeueFontCollectionPath, 'HelveticaNeue-Italic'],
    bolditalics: [HelveticaNeueFontCollectionPath, 'HelveticaNeue-BoldItalic'],
  },
}
