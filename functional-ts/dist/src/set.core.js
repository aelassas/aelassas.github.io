/* functors
*************************************** */
/**
 * Union
 *
*/
export const union = (e, f) => x => e(x) || f(x);
/**
 * Intersection
 *
*/
export const intersection = (e, f) => x => e(x) && f(x);
/**
 * Cartesian product
 *
*/
export const cartesianProduct = (e, f) => (x, y) => e(x) && f(y);
/**
 * Compelemnt
 *
*/
export const complement = (e, f) => x => e(x) && !f(x);
/**
 * Symetric difference without Xor
 *
*/
export const symmetricDifferenceWithoutXor = (e, f) => x => union(complement(e, f), complement(f, e))(x);
/**
 * Symetric difference with Xor
 *
*/
export const symmetricDifferenceWithXor = (e, f) => x => e(x) !== f(x);
/**
 * Contains
 *
*/
export const contains = (e, x) => e(x);
/**
 * Add
 *
*/
export const add = (e, y) => x => x === y || e(x);
/**
 * Remove
 *
*/
export const remove = (e, y) => x => x !== y && e(x);