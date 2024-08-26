/**
 * @type {string}
 */
export const basename = '/cover-art/'

/**
 * @type {(path: string) => string}
 */
export const withBasename = path => `${basename}${path}`
