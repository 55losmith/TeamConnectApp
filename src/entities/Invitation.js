// src/entities/Invitation.js
/**
 * Invitation model
 * @typedef {Object} Invitation
 * @property {string|null} id
 * @property {string|null} eventId
 * @property {string|null} playerId
 * @property {string} status - one of 'pending','accepted','declined'
 * @property {string|null} sentAt - ISO
 */

export const InvitationDefaults = {
  id: null,
  eventId: null,
  playerId: null,
  status: 'pending',
  sentAt: null
};

export function createInvitation(data = {}) {
  return { ...InvitationDefaults, ...data };
}
