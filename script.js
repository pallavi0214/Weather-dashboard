async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const weatherResult = document.getElementById("weatherResult");

    if (city === "") {
        weatherResult.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    weatherResult.innerHTML = "<p>Loading weather...</p>";

    try {
        // Find city
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Location API error");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            weatherResult.innerHTML = `
                <p>City "${city}" was not found.</p>
            `;
            return;
        }

        const location = locationData.results[0];

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather API error");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        weatherResult.innerHTML = `
            <h2>${location.name}, ${location.country}</h2>

            <p>🌡️ Temperature: ${current.temperature_2m} °C</p>

            <p>💧 Humidity: ${current.relative_humidity_2m}%</p>

            <p>💨 Wind Speed: ${current.wind_speed_10m} km/h</p>

            <p>☁️ Weather Code: ${current.weather_code}</p>
        `;

    } catch (error) {
        console.error("Weather Error:", error);

        weatherResult.innerHTML = `
            <p>⚠️ Unable to load weather data.</p>
            <p>Please check your internet connection.</p>
        `;
    }
}