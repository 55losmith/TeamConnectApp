// src/entities/Player.js
/**
 * Player model
 * @typedef {Object} Player
 * @property {string|null} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string|null} email
 * @property {string|null} phone
 * @property {boolean} active
 */

export const PlayerDefaults = {
  id: null,
  firstName: '',
  lastName: '',
  email: null,
  phone: null,
  active: true
};

export function createPlayer(data = {}) {
  return { ...PlayerDefaults, ...data };
}
