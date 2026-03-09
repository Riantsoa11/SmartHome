/**
 * SettingsViewModel — Gestion des appareils personnalisés
 */

import EventBus from "../services/EventBus.js";

export default class SettingsViewModel {

constructor(){

this._devices =
JSON.parse(localStorage.getItem("custom_devices") || "[]");

}

get devices(){
return this._devices;
}

addDevice(device){

if(!device.name || !device.entity) return false;

this._devices.push(device);

localStorage.setItem(
"custom_devices",
JSON.stringify(this._devices)
);

EventBus.emit("devices:custom-updated");

return true;

}

deleteDevice(index){

this._devices.splice(index,1);

localStorage.setItem(
"custom_devices",
JSON.stringify(this._devices)
);

EventBus.emit("devices:custom-updated");

}

}