let APIKey = "2dd6bab44b791b6c4d9157ffee0e930b";
const cityNameEl = document.getElementById("current-city")
const currentTempEl = document.getElementById("temp");
const currentWindEl = document.getElementById("wind");
const currentHumidityEl = document.getElementById("humidity");
const currentUVEl = document.getElementById("uv-index");
const searchEl = document.getElementById("search-button");
let currentCity = $('#city-search').val();
var forecastContainerEl = document.querySelector("#forecast-container");

var getCurrentWeather = () => {
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + APIKey;

    axios.get(apiURL) // https://axios-http.com/docs/intro
    .then((response) => {
        const currentDate = new Date(response.data.dt*1000)
        const day = currentDate.getDate();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        cityNameEl.innerHTML = response.data.name + " " + month + '/' + day + '/' + year;
        currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " °F";
        currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
        currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        axios.get(UVQueryURL)
        .then(function(response){
            let UVIndex = document.createElement("span");
            UVIndex.setAttribute("class","uv-index")
            UVIndex.innerHTML = response.data[0].value;
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(UVIndex);

            // if (uvIndex>=0 && uvIndex<3){
            //     $('#uvVal').attr("class", "uv-favorable");
            // } else if (uvIndex>=3 && uvIndex<8){
            //     $('#uvVal').attr("class", "uv-moderate");
            // } else if (uvIndex>=8){
            //     $('#uvVal').attr("class", "uv-severe");
            // }
        });
    })
}

// 5-day forecast
var fiveDayForecast = () => {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&units=imperial&appid=" + APIKey;
    fetch(forecastURL)
    .then(function(response) {
        response.json()
        .then(function(data) {
            displayForecast(data);
        })
    })
}

var displayForecast = function(weather) {
    forecastContainerEl.textContent = "";
    var forecast = weather.list;
    for (let i = 5; i < forecast.length; i=i+8) {
        var dailyForecast = forecast[i];
        var forecastEl = document.createElement("div");
        forecastEl.classList = "card";
        console.log(dailyForecast);

        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card-body";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        forecastEl.appendChild(weatherIcon);

        var forecastTempEl = document.createElement("span");
        forecastEl.classList = "card-body";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);

        var forecastHumidityEl = document.createElement("span");
        forecastHumidityEl.classList = "card-body";
        forecastHumidityEl.textContent = dailyForecast.main.humidity + "%";
        forecastEl.appendChild(forecastHumidityEl);

        forecastContainerEl.appendChild(forecastEl)
    }
}

$('#search-button').on("click", (event) => {
    event.preventDefault();
    currentCity = $('#city-search').val();
    getCurrentWeather(event);
    fiveDayForecast();
    displayForecast();
})

function k2f(K) {
    return Math.floor((K - 273.15) *1.8 +32);
}