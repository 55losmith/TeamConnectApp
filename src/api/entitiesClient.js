// src/api/entitiesClient.js
/*
  Simple client for entity CRUD operations.
  This is a lightweight, framework-agnostic helper that talks to your backend endpoints.
  It expects an environment variable BASE44_API_BASE or will default to '/api'.
*/

const BASE = (typeof process !== 'undefined' && process.env && process.env.BASE44_API_BASE) || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Request failed ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

export const EntitiesClient = {
  // Events
  listEvents: () => request('/events'),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Players
  listPlayers: () => request('/players'),
  getPlayer: (id) => request(`/players/${id}`),
  createPlayer: (data) => request('/players', { method: 'POST', body: JSON.stringify(data) }),
  updatePlayer: (id, data) => request(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlayer: (id) => request(`/players/${id}`, { method: 'DELETE' }),

  // Invitations
  listInvitations: () => request('/invitations'),
  createInvitation: (data) => request('/invitations', { method: 'POST', body: JSON.stringify(data) }),

  // Messages/threads
  listThreads: () => request('/threads'),
  getThread: (id) => request(`/threads/${id}`),
  createMessage: (data) => request('/messages', { method: 'POST', body: JSON.stringify(data) }),

  // Payments + PitchLogs + TeamSettings
  listPayments: () => request('/payments'),
  listPitchLogs: () => request('/pitchlogs'),
  getTeamSettings: () => request('/teamsettings'),
  updateTeamSettings: (data) => request('/teamsettings', { method: 'PUT', body: JSON.stringify(data) })
};
