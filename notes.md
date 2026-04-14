# Drinkly Notes

[Full course notes](docs/notes.md)

## Service Deliverable

For the service part I used Simon Service as the example for how to organize the project.

- I kept a separate `service` folder with its own `package.json`.
- I used Node.js and Express in `service/index.js`.
- I used `express.static('public')` so the backend can serve the frontend.
- I added auth endpoints for create account, login, logout, and checking the current user.
- I added protected endpoints for hydration data and the leaderboard.
- I used `bcryptjs` to hash passwords.
- I used the Vite proxy so `/api` requests go to port `4000`.
- I used a third-party API from the frontend by calling Open-Meteo on the dashboard.

One thing I learned is that secure cookies should only be forced in production. If they are always secure, login on `http://localhost` can fail.

## DB Deliverable

- Connected to MongoDB Atlas using `MongoClient` in `service/database.js`.
- Used a `dbConfig.json` file (not committed to GitHub) to store credentials.
- `user` collection stores name, hashed password, and auth token.
- `playerData` collection stores streak, intake, weeklyTotal, tree, and dates.
- All data endpoints are protected by `verifyAuth` middleware that checks the cookie token.
- Learned that `upsert: true` in `updateOne` creates the document if it doesn't exist yet.

## WebSocket Deliverable

I studied the Simon WebSocket repository to understand how peer-to-peer communication works before implementing it in Drinkly.

### What peerProxy.js does (backend)

- Simon creates a `WebSocketServer` by passing the existing Express HTTP server directly: `new WebSocketServer({ server: httpServer })`. This means it does not open its own port — it piggybacks on the same port as the REST API.
- When a browser connects, the HTTP connection is automatically upgraded to a WebSocket connection by the `ws` package.
- The server keeps track of all connected clients using `socketServer.clients` (a built-in Set from the `ws` package).
- When any client sends a message, the server loops through all clients and forwards that message to everyone **except** the sender:
  ```js
  socketServer.clients.forEach((client) => {
    if (client !== socket && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
  ```
- **Ping/Pong keep-alive:** Every 10 seconds the server pings every client. Each client that is still alive responds with a pong. If a client does not respond (its `isAlive` is still `false` from the previous cycle), the server terminates that connection. This prevents dead connections from piling up.

### What gameNotifier.js does (frontend)

- The browser uses the built-in `WebSocket` API — no npm package needed on the frontend.
- It checks the current page protocol to decide whether to use `ws://` (for http) or `wss://` (for https). This is important so it works both in development and in production.
- It connects to `/ws` on the same host the page was loaded from: `new WebSocket(\`${protocol}://${window.location.hostname}:${port}/ws\`)`.
- It uses an **observer pattern**: React components call `addHandler(fn)` to register a callback. When a WebSocket message arrives, `receiveEvent` notifies all registered handlers. This keeps WebSocket logic separated from the UI components.
- `broadcastEvent` sends a message to the server by calling `socket.send(JSON.stringify(event))`. The server then forwards it to all other connected clients.
- `onopen` and `onclose` fire system events so the UI can show connection status.

### How vite.config.js proxies /ws

- During development, Vite runs on one port (5173) and the backend runs on another (3000 for Simon, 4000 for Drinkly).
- Without the proxy, a WebSocket connection to `ws://localhost:5173/ws` would fail because Vite does not handle WebSocket traffic.
- Adding this to `vite.config.js` tells Vite to forward any `/ws` request to the backend:
  ```js
  '/ws': {
    target: 'ws://localhost:3000',
    ws: true,
  }
  ```
- The `ws: true` flag is required — without it Vite treats it as a regular HTTP proxy and the upgrade fails.
- This proxy is **only used during development**. It is completely ignored when the app is built and deployed to production.

### How the ws npm package works

- `ws` is a Node.js package that implements the WebSocket protocol.
- You install it with `npm install ws` in the service folder.
- It handles the HTTP → WebSocket protocol upgrade automatically when you pass your HTTP server into it.
- The browser does not need the `ws` package — browsers have WebSocket built in natively.

### Key things I learned

- WebSocket starts as a normal HTTP request with an `Upgrade: websocket` header. The server accepts the upgrade and from that point the connection is bidirectional.
- The server acts as a **proxy/middleman** — clients never talk directly to each other. All messages go through the server which forwards them.
- `ws://` is for non-secure connections (http), `wss://` is for secure connections (https). Using the wrong one in production will cause the connection to fail silently.
- Ping/pong is necessary in production because load balancers and firewalls will close idle connections without it.
- The observer pattern in `gameNotifier.js` / `drinkNotifier.js` is what lets multiple React components all react to the same WebSocket events without tightly coupling them together.

## Run Notes

- Run `npm install` in the root folder.
- Run `npm install` in the `service` folder.
- Run `npm run dev` for the frontend.
- Run `node index.js` inside `service` for the backend.
