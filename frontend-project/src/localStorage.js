/**
 * Support for storing login details in the browser local storage.
 * Formats are as specified in `contexts.js`.
 */

// The key used to store the login details in local storage
const STORAGE_KEY = 'login';

/**
 * Get the login details from local storage.
 *
 * @returns {object} The login details, or null if not found.
 */
export function getLoginDetails() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

/**
 * Save the login details to local storage.
 *
 * @param {object} loginDetails The login details to save.
 */
export function setLoginDetails(loginDetails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loginDetails));
}
