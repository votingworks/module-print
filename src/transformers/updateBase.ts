import {
  parse,
  serialize,
  DefaultTreeDocument,
  DefaultTreeParentNode,
  DefaultTreeElement,
  Attribute,
} from 'parse5'
import { File } from '../manager'

/**
 * Similar to `getElementsByTagName` on a real DOM, but just returns the first one.
 *
 * @todo There's a lot of casting going on here. Can we fix that?
 */
function findElementByTagName(
  root: DefaultTreeParentNode,
  tagName: string
): DefaultTreeElement | undefined {
  const nodes: DefaultTreeElement[] = [root as DefaultTreeElement]

  while (nodes.length) {
    const node = nodes.shift() as DefaultTreeElement

    if (node.nodeName === tagName) {
      return node
    }

    nodes.push(
      ...((node as DefaultTreeElement).childNodes as DefaultTreeElement[])
    )
  }

  return undefined
}

/**
 * Modifies HTML files by adding a `<base>` tag pointing to the original origin.
 */
export default async function updateBase(input: File): Promise<File> {
  if (input.contentType !== 'text/html' || !input.origin) {
    return input
  }

  const html = input.content.toString('utf8')
  const document = parse(html) as DefaultTreeDocument
  const head = findElementByTagName(document, 'head') as DefaultTreeElement
  let base = findElementByTagName(head, 'base')

  if (!base) {
    // No existing `<base>`, add it.
    base = {
      tagName: 'base',
      nodeName: 'base',
      attrs: [
        {
          name: 'href',
          value: input.origin,
        },
      ],
      namespaceURI: 'http://www.w3.org/1999/xhtml',
      childNodes: [],
      parentNode: head,
    }

    head.childNodes.push(base)
  } else {
    // There is a `<base>`, but maybe no `href` attribute?
    let hrefAttr: Attribute | undefined

    for (const attr of base.attrs) {
      if (attr.name === 'href') {
        hrefAttr = attr
        break
      }
    }

    if (!hrefAttr) {
      // No `href` attribute, so let's add one.
      hrefAttr = {
        name: 'href',
        value: input.origin,
      }

      base.attrs.push(hrefAttr)
    }
  }

  return {
    ...input,
    content: Buffer.from(serialize(document)),
  }
}
