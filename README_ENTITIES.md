# Entities added

This branch adds lightweight frontend entity factories, a small API client, and an example React component to bootstrap the manual export of a Base44 app.

Files added:
- src/entities/*.js  (Event, Invitation, Message, Payment, PitchLog, Player, TeamSettings, Thread)
- src/entities/index.js
- src/api/entitiesClient.js
- src/components/entities/EventList.js

Notes:
- Files are written as modern ES modules and use JSDoc for lightweight typing so they work in JS projects and are easy to convert to TypeScript.
- entitiesClient.js is a minimal fetch wrapper that assumes your backend exposes REST-ish endpoints under the base path `/api` (change BASE44_API_BASE env var to override).
- The component is a simple example and may need to be adapted to your app's styling and router.

Next steps:
- If you prefer TypeScript, I can convert these to .ts/.tsx files with interfaces and types.
- If you want backend/ORM models, I can scaffold those too (specify preferred ORM).
- I can open a PR from this branch to `main` when you confirm.
