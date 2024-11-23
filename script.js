const apiKey = "4e1ac8b28fa47e071bed6e448bddaba1"; // Replace with your API key
let currentChart = null; // Variable to keep track of the current chart

document.getElementById("zipForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const zip = document.getElementById("zip").value;
    const warningBox = document.getElementById("warningBox");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&units=imperial&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("Invalid ZIP code or API error");

        const weatherData = await response.json();

        let freezeDetected = false;
        const temperatures = [];
        const hours = [];

        // Process hourly data
        weatherData.list.forEach((forecast) => {
            const temp = forecast.main.temp;
            const time = new Date(forecast.dt_txt).getHours();

            temperatures.push(temp);
            hours.push(`${time}:00`);

            if (temp <= 32) freezeDetected = true;
        });

        // Update the freeze warning
        warningBox.textContent = freezeDetected
            ? "Freeze detected overnight! ❄️"
            : "No freeze detected overnight. 🌡️";

        // Reset the chart if it already exists
        if (currentChart) {
            currentChart.destroy();
        }

        // Render the temperature chart
        currentChart = renderChart(hours, temperatures);
    } catch (error) {
        warningBox.textContent = error.message;
    }
});

function renderChart(labels, data) {
    const ctx = document.getElementById("temperatureChart").getContext("2d");
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Temperature (°F)",
                    data: data,
                    borderColor: "blue",
                    fill: false,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    });
}

