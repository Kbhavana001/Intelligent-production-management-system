Local demo auth server

This demo server provides simple authentication endpoints for local development.

Setup

1. From the `server/` directory run:

   npm install

2. Start the server:

   npm start

The server listens on port 4000 by default and seeds two users:
- username: manufacturer  password: pass123
- username: vendor        password: pass123

Notes
- This is a simple demo only. Do not use the seeded JWT secret in production.
- To use the server with the frontend, set `VITE_API_BASE` to `http://localhost:4000` in your Vite env.
