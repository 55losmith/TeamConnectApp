// src/components/entities/EventList.js
import React, { useEffect, useState } from 'react';
import { EntitiesClient } from '../../api/entitiesClient.js';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    EntitiesClient.listEvents()
      .then((data) => {
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (mounted) setError(err.message || String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading events…</div>;
  if (error) return <div>Error loading events: {error}</div>;

  return (
    <div>
      <h3>Events</h3>
      {events.length === 0 ? (
        <div>No events yet</div>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id || `${e.title}-${Math.random()}`}>{e.title} {e.startDate ? `(${e.startDate})` : ''}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
