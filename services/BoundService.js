class SimpleEventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
  }

  emit(eventName, ...args) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(callback => callback(...args));
  }
}

class BoundService {
  constructor() {
    this.counter = 0;
    this.intervalId = null;
    this.running = false;
    this.eventEmitter = new SimpleEventEmitter();
  }

  start() {
    if (this.running) return;
    
    this.running = true;
    this.counter = 0;
    
    this.intervalId = setInterval(() => {
      this.counter++;
      console.log(`[Bound Service] Count: ${this.counter}`);
      
      // Emit an event with the updated count
      this.eventEmitter.emit('count', this.counter);
    }, 1000);
    
    console.log('Bound service started');
  }

  // Stop the service
  stop() {
    if (!this.running) return;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.running = false;
    console.log('Bound service stopped');
  }

  // Get the current count
  getCount() {
    return this.counter;
  }

  // Reset the counter
  resetCount() {
    this.counter = 0;
    return this.counter;
  }

  // Check if the service is running
  isRunning() {
    return this.running;
  }

  // Subscribe to count updates
  subscribe(callback) {
    this.eventEmitter.on('count', callback);
    return () => this.eventEmitter.off('count', callback);
  }
}

// Create a singleton instance
const boundService = new BoundService();

export default boundService; 