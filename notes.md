## DB Deliverable

- I added a database.js module like Simon DB and connected to MongoDB with a dbConfig.json file.
- I store users (name, hashed password, token) in MongoDB.
- I store hydration data (streak, intake, weekly total, tree info) in MongoDB per user.
## WebSocket Deliverable

I studied the Simon WebSocket repository to understand how peer-to-peer communication works before implementing it in Drinkly.

### What peerProxy.js does (backend)

- Simon creates a `WebSocketServer` by passing the existing Express HTTP server directly: `new WebSocketServer({ server: httpServer })`. This means it does not open its own port â€” it piggybacks on the same port as the REST API.
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

- The browser uses the built-in `WebSocket` API â€” no npm package needed on the frontend.
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
- The `ws: true` flag is required â€” without it Vite treats it as a regular HTTP proxy and the upgrade fails.
- This proxy is **only used during development**. It is completely ignored when the app is built and deployed to production.

### How the ws npm package works

- `ws` is a Node.js package that implements the WebSocket protocol.
- You install it with `npm install ws` in the service folder.
- It handles the HTTP â†’ WebSocket protocol upgrade automatically when you pass your HTTP server into it.
- The browser does not need the `ws` package â€” browsers have WebSocket built in natively.

### Key things I learned

- WebSocket starts as a normal HTTP request with an `Upgrade: websocket` header. The server accepts the upgrade and from that point the connection is bidirectional.
- The server acts as a **proxy/middleman** â€” clients never talk directly to each other. All messages go through the server which forwards them.
- `ws://` is for non-secure connections (http), `wss://` is for secure connections (https). Using the wrong one in production will cause the connection to fail silently.
- Ping/pong is necessary in production because load balancers and firewalls will close idle connections without it.
- The observer pattern in `gameNotifier.js` / `drinkNotifier.js` is what lets multiple React components all react to the same WebSocket events without tightly coupling them together.

## WebSocket Implementation

### What I built for Drinkly

- Created `service/peerProxy.js` â€” a WebSocket server that attaches to the existing Express HTTP server. It forwards drink log events from one connected user to all other connected users in real time.
- Modified `service/index.js` â€” saved the result of `app.listen()` to a variable called `server` and passed it to `DrinkProxy(server)` so the WebSocket server shares the same port as the REST API.
- Installed the `ws` npm package in the `service` folder â€” this is what powers the WebSocket server on the backend.
- Replaced the fake `setInterval` mock in `src/leaderboard/drinkNotifier.js` with a real WebSocket connection using the browser's built-in `WebSocket` API. It uses `ws://` for http and `wss://` for https automatically.
- Added a `sendEvent()` method to `DrinkEventNotifier` so the dashboard can broadcast events to the server.
- Updated `src/dashboard/dashboard.jsx` to call `DrinkNotifier.sendEvent()` every time the user clicks `+ Log Water Intake`. This sends a real-time event to all connected users.
- Updated `src/leaderboard/leaderboard.jsx` to handle both system events (WebSocket connected/disconnected) and drink log events from real users in the Live Activity feed.
- Updated `vite.config.js` to proxy `/ws` requests to `ws://localhost:4000` during development. Without this the WebSocket connection fails when running Vite locally.

### How it works end to end

1. User opens the app â€” `drinkNotifier.js` creates a WebSocket connection to `/ws`
2. Vite (dev) or the Express server (production) handles the connection
3. `peerProxy.js` registers the connection and stores it
4. User clicks Log Water on the dashboard â€” `sendEvent()` sends a JSON message over WebSocket
5. `peerProxy.js` receives the message and forwards it to all other connected clients
6. Other users' `drinkNotifier.js` receives the message via `onmessage` and notifies handlers
7. `leaderboard.jsx` handler fires and updates the Live Activity feed instantly

### What I verified

- Opened two browser windows logged in as different users
- Logged water in one window and confirmed the Live Activity feed updated in the other window in real time
- Confirmed `WebSocket connected` appears in the feed when the leaderboard loads
- Checked the Network tab in DevTools and confirmed the `/ws` WebSocket connection is active

## Run Notes

- Run `npm install` in the root folder.
- Run `npm install` in the `service` folder.
- Run `npm run dev` for the frontend.
- Run `node index.js` inside `service` for the backend.

