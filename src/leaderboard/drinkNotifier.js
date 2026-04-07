const DrinkEvent = {
  Log: 'waterLog',
  NewDay: 'newDay',
};

class DrinkEventNotifier {
  handlers = [];

  constructor() {
    // This will be replaced with WebSocket messages from the server
    const mockUsers = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey'];
    setInterval(() => {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const oz = (Math.floor(Math.random() * 5) + 1) * 8;
      this.broadcastEvent(user, DrinkEvent.Log, { oz });
    }, 5000);
  }

  broadcastEvent(from, type, value) {
    const event = { from, type, value };
    this.handlers.forEach((handler) => handler(event));
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
