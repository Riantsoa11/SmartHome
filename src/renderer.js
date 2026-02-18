import DeviceViewModel from './viewmodels/DeviceViewModel.js';

const viewModel = new DeviceViewModel(window.api);

// DOM Elements (peuvent être null selon le HTML actuel)
const energyChart = document.getElementById('energy-chart');
const climateControls = document.getElementById('climate-controls');
const weatherForecast = document.getElementById('weather-forecast');
const deviceGrid = document.getElementById('device-grid');

// Initialize
async function init() {
    await Promise.all([
        renderEnergyChart(),
        renderClimateControls(),
        renderWeatherForecast(),
        renderDevices()
    ]);
}

/* ===========================
   ENERGY
=========================== */
async function renderEnergyChart() {
    if (!energyChart) return;

    const energyData = await viewModel.loadEnergy();

    energyChart.innerHTML = energyData.chart.map((item, index) => {
        const colors = ['#FF9500', '#FF006B', '#7B2FFF', '#00D9FF', '#00FF88'];
        const color = colors[index % colors.length];
        const height = (item.value / 33.7) * 100;

        return `
            <div class="chart-bar" style="--color: ${color}; height: ${height}%">
                <div class="chart-value">${item.value} kWh</div>
                <div class="chart-label">${item.day}</div>
            </div>
        `;
    }).join('');
}

/* ===========================
   CLIMATE
=========================== */
async function renderClimateControls() {
    if (!climateControls) return;

    const climates = await viewModel.loadClimateDevices();

    climateControls.innerHTML = climates.map(climate => `
        <div class="climate-item">
            <div class="climate-info">
                <div class="climate-icon" style="background: ${climate.color}">
                    ${climate.icon}
                </div>
                <div>
                    <div class="climate-name">${climate.name}</div>
                    <div class="climate-status">${climate.status}</div>
                </div>
            </div>
            <div class="climate-slider" data-id="${climate.id}">
                <div class="climate-slider-fill"
                     style="--color: ${climate.color}; width: ${climate.value}%">
                    <div class="climate-slider-thumb"></div>
                </div>
            </div>
            <div class="climate-value">${climate.value}%</div>
        </div>
    `).join('');

    document.querySelectorAll('.climate-slider').forEach(slider => {
        slider.addEventListener('click', (e) => {
            const id = parseInt(slider.dataset.id);
            const rect = slider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const value = Math.round((x / rect.width) * 100);

            viewModel.updateClimateValue(id, value);
            renderClimateControls();
        });
    });
}

/* ===========================
   WEATHER
=========================== */
async function renderWeatherForecast() {
    if (!weatherForecast) return;

    const weather = await viewModel.loadWeather();

    const icons = {
        rain: '🌧️',
        storm: '⛈️',
        cloudy: '☁️'
    };

    weatherForecast.innerHTML = weather.forecast.map(item => `
        <div class="forecast-item">
            <div class="forecast-icon">
                ${icons[item.type] || '☁️'}
            </div>
            <div style="flex: 1;">
                <div class="forecast-time">${item.time}</div>
                <div class="forecast-type">${item.name}</div>
            </div>
            <div>
                <span class="forecast-temp">${item.temp}°</span>
                <span class="forecast-temp-low">/${item.tempLow}°</span>
            </div>
        </div>
    `).join('');
}

/* ===========================
   DEVICES
=========================== */
async function renderDevices() {
    if (!deviceGrid) return;

    const devices = await viewModel.loadDevices();

    deviceGrid.innerHTML = devices.map(device => {
        const activeClass = device.status ? 'active' : '';
        const colorVars = device.status
            ? `--device-color-start: ${device.color.start}; --device-color-end: ${device.color.end}`
            : '';

        return `
            <div class="device-card ${activeClass}"
                 style="${colorVars}"
                 data-id="${device.id}">
                <div class="device-status">${device.status ? 'ON' : 'OFF'}</div>
                <div class="device-icon">${device.icon}</div>
                <div class="device-name">${device.name}</div>
                <div class="device-location">${device.location}</div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.device-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            viewModel.toggleDevice(id);
            renderDevices();
        });
    });
}

/* ===========================
   ROOM LIGHT
=========================== */
document.getElementById('room-light-toggle')?.addEventListener('change', (e) => {
    window.api.notify(`Room light is now ${e.target.checked ? 'ON' : 'OFF'}`);
});

// Start
init();
