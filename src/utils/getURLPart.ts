/**
 * Gets part of a URL if there is a URL value.
 */
export default function getURLPart<K extends keyof URL>(
  url: string | undefined,
  part: K
): URL[K] | undefined {
  if (typeof url === 'undefined') {
    return url
  }

  return new URL(url)[part]
}
