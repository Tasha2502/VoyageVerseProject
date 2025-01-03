const apiKey = '4318532abd3172bff6ea3f91aadb0e84';  // Replace with your OpenWeatherMap API key

const getWeatherButton = document.getElementById("getWeather");
const weatherResult = document.getElementById("weatherResult");

getWeatherButton.addEventListener("click", () => {
  const city = document.getElementById("city").value.trim();

  if (city === "") {
    weatherResult.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  // Constructing the Weatherstack API URL
  const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}&units=m`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found or invalid API key");
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});

function displayWeather(data) {
  const { current, location } = data;

  if (!current) {
    weatherResult.innerHTML = "<p>Weather data is not available. Please try again later.</p>";
    return;
  }

  const weatherHTML = `
    <div class="weather-data">
      <h2>Weather for ${location.name}, ${location.country}</h2>
      <p>Temperature: ${current.temperature}°C</p>
      <p>Weather: ${current.weather_descriptions[0]}</p>
      <p>Wind Speed: ${current.wind_speed} km/h</p>
      <p>Humidity: ${current.humidity}%</p>
      <p>Pressure: ${current.pressure} hPa</p>
    </div>
  `;

  weatherResult.innerHTML = weatherHTML;
}