// src/entities/Message.js
/**
 * Message model
 * @typedef {Object} Message
 * @property {string|null} id
 * @property {string|null} threadId
 * @property {string|null} senderId
 * @property {string} body
 * @property {string|null} sentAt - ISO
 */

export const MessageDefaults = {
  id: null,
  threadId: null,
  senderId: null,
  body: '',
  sentAt: null
};

export function createMessage(data = {}) {
  return { ...MessageDefaults, ...data };
}
