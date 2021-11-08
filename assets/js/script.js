const APIkey = "2dd6bab44b791b6c4d9157ffee0e930b";
const cityNameEl = document.getElementById("current-city")
const currentTempEl = document.getElementById("temp");
const currentWindEl = document.getElementById("wind");
const currentHumidityEl = document.getElementById("humidity");
const currentUVEl = document.getElementById("uv-index");

var getCurrentWeather = () => {
    let city = $('#city-search').val();
    currentCity = $('#city-search').val();
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    axios.get(apiURL) // https://axios-http.com/docs/intro
    .then((response) => {
        const currentDate = new Date(response.data.dt*1000)
        const day = currentDate.getDate();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        cityNameEl.innerHTML = response.data.name + " " + month + '/' + day + '/' + year;
        currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
        currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
        currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        let uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        fetch(uvQueryURL)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let uvIndex = response.value;
            $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
            if (uvIndex>=0 && uvIndex<3){
                $('#uvVal').attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $('#uvVal').attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $('#uvVal').attr("class", "uv-severe");
            }
        });

    })
}