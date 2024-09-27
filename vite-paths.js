/**
 * @type {string}
 */
export const basename = '/'

/**
 * @type {(path: string) => string}
 */
export const withBasename = path => `${basename}${path}`
