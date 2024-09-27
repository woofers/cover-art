/**
 * @type {string}
 */
export const basename =
  process.env.NODE_ENV !== 'development' ? '/cover-art/' : '/'

/**
 * @type {(path: string) => string}
 */
export const withBasename = path => `${basename}${path}`
