import EventBus from "../../services/EventBus.js";

export default class SettingsView {

constructor(vm){
this.vm = vm;
}

init(){

this._bindEvents();
this.render();

EventBus.on("devices:custom-updated", () => this.render());

}

render(){

const list = document.getElementById("custom-devices-list");

if(!list) return;

const devices = this.vm.devices;

if(!devices.length){

list.innerHTML =
`<div style="opacity:.6">Aucun appareil ajouté</div>`;

return;

}

list.innerHTML = devices.map((d,i)=>`

<div class="device-row">

<div class="device-name">
${d.icon ?? "🔧"} ${d.name}
</div>

<button data-index="${i}" class="dev-del">
Supprimer
</button>

</div>

`).join("");

}

_bindEvents(){

document
.getElementById("btn-add-device")
?.addEventListener("click",()=>{

const name =
document.getElementById("device-name").value;

const entity =
document.getElementById("device-entity").value;

const type =
document.getElementById("device-type").value;

const icon =
document.getElementById("device-icon").value;

const ok = this.vm.addDevice({
name,
entity,
type,
icon
});

if(ok){

document.getElementById("device-name").value="";
document.getElementById("device-entity").value="";

}

});

document
.getElementById("custom-devices-list")
?.addEventListener("click",e=>{

const btn = e.target.closest(".dev-del");

if(!btn) return;

this.vm.deleteDevice(
parseInt(btn.dataset.index)
);

});

}

}