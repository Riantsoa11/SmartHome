import DeviceViewModel from './viewmodels/DeviceViewModel.js';

const viewModel = new DeviceViewModel(window.api);
const container = document.getElementById("devices");

async function render() {
    container.innerHTML = "";
    const devices = await viewModel.loadDevices();

    devices.forEach(device => {
        const card = document.createElement("div");
        card.className = "device-card";

        card.innerHTML = `
            <h3>${device.name}</h3>
            <p>Type: ${device.type}</p>
            <button>${device.status ? "ON" : "OFF"}</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
            viewModel.toggleDevice(device.id);

            window.api.notify(
                `${device.name} est maintenant ${device.status ? "ON" : "OFF"}`
        );

    render();
});


        container.appendChild(card);
    });
}

render();
