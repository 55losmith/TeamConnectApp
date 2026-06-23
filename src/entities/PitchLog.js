// src/entities/PitchLog.js
/**
 * PitchLog model
 * @typedef {Object} PitchLog
 * @property {string|null} id
 * @property {string|null} playerId
 * @property {string|null} eventId
 * @property {number|null} pitchCount
 * @property {string|null} recordedAt - ISO
 */

export const PitchLogDefaults = {
  id: null,
  playerId: null,
  eventId: null,
  pitchCount: null,
  recordedAt: null
};

export function createPitchLog(data = {}) {
  return { ...PitchLogDefaults, ...data };
}
