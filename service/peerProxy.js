const { WebSocketServer, WebSocket } = require('ws');
const uuid = require('uuid');

function DrinkProxy(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  let connections = [];

  socketServer.on('connection', (socket) => {
    const connection = { id: uuid.v4(), alive: true, ws: socket };
    connections.push(connection);

    socket.on('message', function message(data) {
      connections.forEach((c) => {
        if (c.id !== connection.id && c.ws.readyState === WebSocket.OPEN) {
          c.ws.send(data);
        }
      });
    });

    socket.on('close', () => {
      connections = connections.filter((c) => c.id !== connection.id);
    });

    socket.on('pong', () => {
      connection.alive = true;
    });
  });

  setInterval(() => {
    connections.forEach((c) => {
      if (!c.alive) return c.ws.terminate();
      c.alive = false;
      c.ws.ping();
    });
  }, 10000);
}

module.exports = { DrinkProxy };
