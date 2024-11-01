/* functors
*************************************** */
/**
 * Empty set
*/
export const empty = () => e => false;
/**
 * Set All
*/
export const all = () => e => true;
/**
 * Singleton set
*/
export const singleton = x => y => x === y;