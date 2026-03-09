/**
 * EventBus — Communication découplée entre ViewModels et Views
 *
 * Usage:
 *   EventBus.emit('devices:updated', devices)   ← dans un ViewModel
 *   EventBus.on('devices:updated', cb)           ← dans une View
 */
const EventBus = {
  _listeners: {},

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    // Retourne une fonction de nettoyage
    return () => this.off(event, callback);
  },

  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  },

  emit(event, data) {
  (this._listeners[event] || []).forEach(cb => {
    try {
      cb(data);
    } catch (err) {
      console.error(`EventBus error (${event})`, err);
    }
  });
},

  clear(event) {
    if (event) delete this._listeners[event];
    else this._listeners = {};
  }
};


export default EventBus;
