export function normalizeHost(url: string) {
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `http://\${url}`;
}
