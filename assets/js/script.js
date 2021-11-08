const APIkey = "2dd6bab44b791b6c4d9157ffee0e930b"

var getCurrentWeather = () => {
    let city = $('#city-search').val();
    currentCity = $('#city-search').val();
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    fetch(apiURL)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        // make the json do stuff
    })
}