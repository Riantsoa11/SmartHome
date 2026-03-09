/**
 * Device — Modèle d'un appareil domotique
 *
 * Responsabilités :
 *   - Représenter l'état d'un appareil
 *   - Règles métier (toggle, setValue, validation)
 *
 * ❌ Pas de DOM ici
 * ❌ Pas d'appels réseau ici
 */
export default class Device {
  constructor({ id, name, type, status, value, icon, color, location }) {
    this.id       = id;
    this.name     = name;
    this.type     = type;           // 'light' | 'blind' | 'climate'
    this.status   = status ?? false;
    this.value    = value  ?? 0;
    this.icon     = icon   ?? '💡';
    this.color    = color  ?? { start: '#FF9500', end: '#FFD700' };
    this.location = location ?? 'Pièce inconnue';
  }

  toggle() {
    this.status = !this.status;
  }

  setValue(value) {
    this.value = Math.max(0, Math.min(100, value));
  }

  // Valeur affichable (ex: "75%" ou "ON")
  get displayValue() {
    if (this.type === 'light') return this.status ? `${this.value}%` : 'Éteint';
    if (this.type === 'blind') return `${this.value}%`;
    return this.status ? 'ON' : 'OFF';
  }
}
