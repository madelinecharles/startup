const DrinkEvent = {
  Log: 'waterLog',
  NewDay: 'newDay',
  System: 'system',
};

class DrinkEventNotifier {
  handlers = [];
  socket = null;

  constructor() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    this.socket.onopen = () => {
      this.broadcastEvent('system', DrinkEvent.System, { msg: 'connected' });
    };

    this.socket.onclose = () => {
      this.broadcastEvent('system', DrinkEvent.System, { msg: 'disconnected' });
    };

    this.socket.onmessage = async (msg) => {
      try {
        const text = await msg.data.text();
        const event = JSON.parse(text);
        this.broadcastEvent(event.from, event.type, event.value);
      } catch {}
    };
  }

  broadcastEvent(from, type, value) {
    const event = { from, type, value };
    this.handlers.forEach((handler) => handler(event));
  }

  sendEvent(from, type, value) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ from, type, value }));
    }
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }
}

const DrinkNotifier = new DrinkEventNotifier();
export { DrinkEvent, DrinkNotifier };
