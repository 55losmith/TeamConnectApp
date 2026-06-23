// src/entities/Event.js
/**
 * Event model and factory
 * @typedef {Object} Event
 * @property {string|null} id
 * @property {string} title
 * @property {string} description
 * @property {string|null} startDate - ISO string
 * @property {string|null} endDate - ISO string
 * @property {string|null} location
 * @property {string[]} attendees - array of player ids
 */

export const EventDefaults = {
  id: null,
  title: '',
  description: '',
  startDate: null,
  endDate: null,
  location: null,
  attendees: []
};

export function createEvent(data = {}) {
  return { ...EventDefaults, ...data };
}
