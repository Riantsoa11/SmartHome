export default class SettingsView {

constructor(vm){

this.vm = vm;

}

init(){

document
.getElementById("btn-save-ha")
?.addEventListener("click", () => {

const url =
document.getElementById("ha-url").value;

const token =
document.getElementById("ha-token").value;

this.vm.saveHAConfig(url, token);

alert("Connexion sauvegardée");

});


document
.getElementById("btn-add-device")
?.addEventListener("click", () => {

const name =
document.getElementById("device-name").value;

const entity =
document.getElementById("device-entity").value;

const type =
document.getElementById("device-type").value;

this.vm.addDevice({
name,
entity,
type
});

alert("Appareil ajouté");

});

}

}