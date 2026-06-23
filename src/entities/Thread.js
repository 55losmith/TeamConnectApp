// src/entities/Thread.js
/**
 * Thread model
 * @typedef {Object} Thread
 * @property {string|null} id
 * @property {string} title
 * @property {string[]} messageIds
 * @property {string|null} createdAt - ISO
 */

export const ThreadDefaults = {
  id: null,
  title: '',
  messageIds: [],
  createdAt: null
};

export function createThread(data = {}) {
  return { ...ThreadDefaults, ...data };
}
