export default class Device {
    constructor(id, name, type, status, value, icon, color, location) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
        this.value = value || 0;
        this.icon = icon || '💡';
        this.color = color || { start: '#FF9500', end: '#FFD700' };
        this.location = location || 'Room';
    }

    toggle() {
        this.status = !this.status;
    }

    setValue(value) {
        this.value = Math.max(0, Math.min(100, value));
    }
}
