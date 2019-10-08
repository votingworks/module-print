/* eslint-disable no-await-in-loop */

import * as fs from 'fs'
import { promisify } from 'util'
import { join, extname, basename } from 'path'

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

export interface Fonts {
  [key: string]: {
    [key: string]: string | [string, string]
  }
}

export interface System {
  entries(path: string): Promise<string[]>
  isFile(path: string): Promise<boolean>
}

const RealSystem: System = {
  async entries(path: string): Promise<string[]> {
    return readdir(path)
  },

  async isFile(path: string): Promise<boolean> {
    const result = await stat(path)
    return result.isFile()
  },
}

export default class FontCache {
  private fonts?: Fonts

  constructor(
    private readonly root = join(__dirname, '..', '..', 'fonts'),
    private readonly sys = RealSystem
  ) {}

  async getFonts(): Promise<Fonts> {
    if (!this.fonts) {
      this.fonts = await this.loadFonts()
    }

    return this.fonts
  }

  private async loadFonts(): Promise<Fonts> {
    const fonts: Fonts = {}

    for (const entry of await this.sys.entries(this.root)) {
      const path = join(this.root, entry)

      if (await this.sys.isFile(path)) {
        const ext = extname(path)

        if (ext === '.ttc') {
          const base = basename(path, ext)

          fonts[base] = {
            normal: [path, base],
            bold: [path, `${base}-Bold`],
            italics: [path, `${base}-Italic`],
            bolditalics: [path, `${base}-BoldItalic`],
          }
        } else {
          throw new Error(`unknown font type (${ext}): ${path}`)
        }
      }
    }

    return fonts
  }
}
