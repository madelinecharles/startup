const { WebSocketServer, WebSocket } = require('ws');
const uuid = require('uuid');

function DrinkProxy(httpServer) {
  // Attach WebSocket server to the existing Express HTTP server
  const socketServer = new WebSocketServer({ server: httpServer });

  let connections = [];

  socketServer.on('connection', (socket) => {
    const connection = { id: uuid.v4(), alive: true, ws: socket };
    connections.push(connection);

    // Forward messages to everyone except the sender
    socket.on('message', function message(data) {
      connections.forEach((c) => {
        if (c.id !== connection.id && c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(data);
        }
      });
    });

    // Remove connection when client disconnects
    socket.on('close', () => {
      connections = connections.filter((c) => c.id !== connection.id);
    });

    // Mark connection alive when pong is received
    socket.on('pong', () => {
      connection.alive = true;
    });
  });

  // Ping all clients every 10 seconds, terminate any that don't respond
  setInterval(() => {
    connections.forEach((c) => {
      if (!c.alive) return c.ws.terminate();
      c.alive = false;
      c.ws.ping();
    });
  }, 10000);
}

module.exports = { DrinkProxy };
