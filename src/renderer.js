import DeviceViewModel from './viewmodels/DeviceViewModel.js';

const viewModel = new DeviceViewModel(window.api);

// DOM Elements
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

// Render Energy Chart
async function renderEnergyChart() {
    const energyData = await viewModel.loadEnergy();
    
    energyChart.innerHTML = energyData.chart.map((item, index) => {
        const colors = ['#FF9500', '#FF006B', '#7B2FFF', '#00D9FF', '#00FF88'];
        const color = colors[index % colors.length];
        const height = (item.value / 33.7) * 100; // Max value is 33.7 kWh
        
        return `
            <div class="chart-bar" style="--color: ${color}; height: ${height}%">
                <div class="chart-value">${item.value} kWh</div>
                <div class="chart-label">${item.day}</div>
            </div>
        `;
    }).join('');
}

// Render Climate Controls
async function renderClimateControls() {
    const climates = await viewModel.loadClimateDevices();
    
    climateControls.innerHTML = climates.map(climate => {
        return `
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
                    <div class="climate-slider-fill" style="--color: ${climate.color}; width: ${climate.value}%">
                        <div class="climate-slider-thumb"></div>
                    </div>
                </div>
                <div class="climate-value">${climate.value}%</div>
            </div>
        `;
    }).join('');

    // Add click listeners to sliders
    document.querySelectorAll('.climate-slider').forEach(slider => {
        slider.addEventListener('click', (e) => {
            const id = parseInt(slider.dataset.id);
            const rect = slider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const value = Math.round((x / width) * 100);
            
            viewModel.updateClimateValue(id, value);
            renderClimateControls();
        });
    });
}

// Render Weather Forecast
async function renderWeatherForecast() {
    const weather = await viewModel.loadWeather();
    
    const icons = {
        rain: '🌧️',
        storm: '⛈️',
        cloudy: '☁️'
    };
    
    weatherForecast.innerHTML = weather.forecast.map(item => {
        return `
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
        `;
    }).join('');
}

// Render Devices
async function renderDevices() {
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

    // Add click listeners to device cards
    document.querySelectorAll('.device-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            viewModel.toggleDevice(id);
            renderDevices();
        });
    });
}

// Room light toggle
document.getElementById('room-light-toggle')?.addEventListener('change', (e) => {
    window.api.notify(`Room light is now ${e.target.checked ? 'ON' : 'OFF'}`);
});

// Initialize the app
init();
