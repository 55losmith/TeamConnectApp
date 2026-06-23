// src/entities/TeamSettings.js
/**
 * TeamSettings model
 * @typedef {Object} TeamSettings
 * @property {string|null} id
 * @property {string|null} teamName
 * @property {Object} preferences
 */

export const TeamSettingsDefaults = {
  id: null,
  teamName: null,
  preferences: {}
};

export function createTeamSettings(data = {}) {
  return { ...TeamSettingsDefaults, ...data };
}
