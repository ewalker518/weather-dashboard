let APIKey = "2dd6bab44b791b6c4d9157ffee0e930b";
const cityNameEl = document.getElementById("current-city")
const currentTempEl = document.getElementById("temp");
const currentWindEl = document.getElementById("wind");
const currentHumidityEl = document.getElementById("humidity");
const currentUVEl = document.getElementById("uv-index");
const searchEl = document.getElementById("search-button");
// let currentCity = $('#city-search').val();
var forecastContainerEl = document.querySelector("#forecast-container");
var recentSearch = document.querySelector("#recent-city");
var recentSearchButton = document.querySelector(".recent-search-btn");
let searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];
var recentSearchButtonEl = document.querySelector("#past-search-button");

var getCurrentWeather = () => {
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + APIKey;

    axios.get(apiURL) // https://axios-http.com/docs/intro
        .then((response) => {
            const currentDate = new Date(response.data.dt * 1000)
            const day = currentDate.getDate();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            cityNameEl.innerHTML = response.data.name + " " + month + '/' + day + '/' + year;
            cityNameEl.setAttribute("class", "card-title")
            currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " °F";
            currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
            currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            axios.get(UVQueryURL)
                .then(function (response) {
                    let UVIndex = document.createElement("span");
                    UVIndex.setAttribute("class", "uv-index")
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
            saveCity();
            recentSearch(currentCity);
        })
}

// 5-day forecast
var fiveDayForecast = () => {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&units=imperial&appid=" + APIKey;
    fetch(forecastURL)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    displayForecast(data);
                })
        })
}

var displayForecast = function (weather) {
    forecastContainerEl.textContent = "";
    var forecast = weather.list;
    for (let i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];
        var forecastEl = document.createElement("div");
        forecastEl.classList = "day bg-primary col card mr-2";

        var forecastDateEl = document.createElement("div");
        var forecastDate = new Date(weather.dt * 1000);
        var forecastMonth = forecastDate.getMonth() + 1;
        var forecastDay = forecastDate.getDate();
        var forecastYear = forecastDate.getFullYear();
        forecastDate.textContent = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastDateEl.append(forecastDate);

        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card bg-primary";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        forecastEl.appendChild(weatherIcon);

        var forecastTempEl = document.createElement("div");
        forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);

        var forecastHumidityEl = document.createElement("div");
        forecastHumidityEl.classList = "card";
        forecastHumidityEl.textContent = "Humidity: " + dailyForecast.main.humidity + "%";
        forecastEl.appendChild(forecastHumidityEl);

        forecastContainerEl.appendChild(forecastEl)
    }
}

function saveCity(cities) {
    localStorage.setItem("Cities", JSON.stringify(cities));
}

function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

var recentSearch = function (recentSearch) {
    recentSearchEl = document.createElement("button");
    recentSearchEl.textContent = recentSearch;
    recentSearchEl.classList = "btn btn-secondary";
    recentSearchEl.setAttribute("recent-city", recentSearch)
    recentSearchEl.setAttribute("type", "submit");
    recentSearchButtonEl.prepend(recentSearchEl);
}

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("recent-city")
    console.log(city);
    if(city){
        currentCity = city;
        getCurrentWeather(currentCity);
        fiveDayForecast(currentCity);
    }
}

$('#search-button').on("click", (event) => {
    event.preventDefault();
    currentCity = $('#city-search').val();
    getCurrentWeather(event);
    fiveDayForecast();
    searchHistory.push(currentCity);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
});

recentSearchButtonEl.addEventListener("click", pastSearchHandler);