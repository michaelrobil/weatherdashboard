let todayDate = new Date();
let today = `${todayDate.getMonth() + 1}/${todayDate.getDate()}/${todayDate.getFullYear()}`;
let weatherBox;
let temp;
let city;
let humidity;
let windSpeed;
let newCityBox;
let newCityText;
let newCityBtn;
let deleteBtn;
let existing = {};
const locationIcon = $("#current-city").append('<i class="fas fa-map-marker-alt"></i>');

//API calls
// API for daily weather by city
function displayWeather() {
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=65bb0a9399a9e35557159693e192db55";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => {
        // convert temp
        const tempConverted = Math.round(((response.main.temp) - 273.15) * 9 / 5 + 32);
        weatherBox = $("<div>");
        const icon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
        temp = $(`<p>Temperature: ${tempConverted}‎ °F</p>`);
        humidity = $(`<p>Humidity: ${response.main.humidity}‎ %</p>`);
        windSpeed = $(`<p>Wind Speed: ${response.wind.speed}‎ MPH</p>`);
        $("#city-view").empty().append(weatherBox);
        $(weatherBox).prepend($(`<h2>${response.name} ${today}</h2>`).append(icon)).append(temp, humidity, windSpeed);
        $("#forecast").empty().prepend($(`<h4>5 Days Forecast: </h4>`));
        latValue = response.coord.lat;
        lonValue = response.coord.lon;
        uvIndexValue();
    });
}
// API for UV Index
function uvIndexValue() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?" + "&APPID=65bb0a9399a9e35557159693e192db55" + "&lat=" + latValue + "&lon=" + lonValue,
        method: "GET"
    }).then(response => {
        $(weatherBox).append($(`<p>UV Index: ${response.value}</p>`));
    });
}
// API for Forecast
function forecastValues() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=65bb0a9399a9e35557159693e192db55",
        method: "GET"
    }).then(response => {
        const forecastTimes = ["4", "10", "18", "26", "34"];
        forecastTimes.forEach(item => {
            const listItem = response.list[item];
            const forecastDate = ((listItem.dt_txt).slice(0, 10));
            const forecastIcon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${listItem.weather[0].icon}@2x.png`);
            const forecastTemp = $(`<p>Temperature: ${Math.round(((listItem.main.temp) - 273.15) * 9 / 5 + 32)}‎ °F</p>`);
            const forecastHumidity = $(`<p>Humidity: ${listItem.main.humidity}‎ %</p>`);
            $("#day" + item).empty().append(forecastDate, forecastIcon, forecastTemp, forecastHumidity);
        });
    });
}
//localstorage & adding buttons
function createNsaveBtn() {
    existing = localStorage.getItem('city');
    existing = existing ? existing.split(',') : [];
    if (city) { existing.unshift(city); }
    localStorage.setItem('city', existing.toString());
    existing.forEach(item => {
        newCityBox = $('<div class=' + item + 'box >').attr("id", "citybox");
        newCityBtn = $('<button>').attr("id", "city").attr("data-name", item);
        deleteBtn = $('<button>').attr("id", "remove").attr("data-name", item);
        deleteBtn.append($('<i class="far fa-trash-alt"></i>'));
        (newCityBtn).text(item.charAt(0).toUpperCase() + item.substring(1));
        $("#buttons-view").append(newCityBox.append(newCityBtn, deleteBtn));
    })
}
createNsaveBtn();
//event listener for created buttons
$(document).on("click", "#city", event => {
    event.preventDefault();
    // This line grabs the input from the textbox
    city = event.target.getAttribute('data-name');
    displayWeather();
    forecastValues();
});
// event listener for delete form localstorage and UI
$(document).on("click", "#remove", event => {
    event.preventDefault();
    city = event.target.getAttribute('data-name');
    let string = localStorage.getItem('city');
    if (string.includes(city + ",")) {
        string = string.replace(city + ",", "");
    } else if (string.includes("," + city)) {
        string = string.replace("," + city, "")
    } else string.replace(city, "");
    localStorage.setItem("city", string);
    $("." + city + "box").empty();
});

//event listener for submit buttons
$("#add-city").on("click", event => {
    event.preventDefault();
    // This line grabs the input from the textbox
    city = $("#city-input").val().trim();
    displayWeather();
    forecastValues();
    $("#buttons-view").empty();
    createNsaveBtn();
});
//event listener and function for corrent location weather
$("#current-city").on("click", event => {
    event.preventDefault();
    jQuery(document).ready($ => {
        $.ajax({
            url: "https://geolocation-db.com/jsonp",
            jsonpCallback: "callback",
            dataType: "jsonp",
            success: location => {
                city = location.city;
                displayWeather();
                forecastValues();
            }
        });
    });
});