var todayDate = new Date();
var today = (todayDate.getMonth() + 1) + "/" + todayDate.getDate() + "/" + todayDate.getFullYear();
var weatherBox;
var cityName;
var temp;
var city;
var humidity;
var windSpeed;
var uvIndex;
var newCityBox;
var newCityText;
var newCityBtn;
var deleteBtn;
var existing = {};

//API calls
function displayWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=65bb0a9399a9e35557159693e192db55";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        $("#city-view").empty();
        // convert temp
        var tempConverted = Math.round(((response.main.temp) - 273.15) * 9 / 5 + 32);
        weatherBox = $("<div>");
        var icon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
        temp = $("<p>" + "Temperature: " + tempConverted + "‎ °F" + "</p>");
        humidity = $("<p>" + "Humidity: " + response.main.humidity + "‎ %" + "</p>");
        windSpeed = $("<p>" + "Wind Speed: " + response.wind.speed + "‎ MPH" + "</p>");
        $("#city-view").append(weatherBox);
        $(weatherBox).append(temp, humidity, windSpeed);
        $("#forecast").empty();
        $("#forecast").prepend($("<h4>5 Days Forecast: </h4>"));
        cityName = $("<h2>" + response.name + " " + today + "</h2>");
        cityName.append(icon);
        $(weatherBox).prepend(cityName);
        latValue = response.coord.lat;
        lonValue = response.coord.lon;
        uvIndexValue();
    });
}

function uvIndexValue() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?" + "&APPID=65bb0a9399a9e35557159693e192db55" + "&lat=" + latValue + "&lon=" + lonValue,
        method: "GET"
    }).then(function(response) {
        uvIndex = $("<p>" + "UV Index: " + response.value + "</p>");
        $(weatherBox).append(uvIndex);
    });
}

function forecastValues() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=65bb0a9399a9e35557159693e192db55",
        method: "GET"
    }).then(function(response) {
        var forecastTimes = ["4", "10", "18", "26", "34"];
        forecastTimes.forEach(function(item) {
            $("#day" + item).empty();
            var listItem = response.list[item];
            var dateOne = ((listItem.dt_txt).slice(0, 10));
            var iconOne = $('<img>').attr('src', `http://openweathermap.org/img/wn/${listItem.weather[0].icon}@2x.png`);
            var tempOne = $("<p>" + "Temperature: " + Math.round(((listItem.main.temp) - 273.15) * 9 / 5 + 32) + "‎ °F" + "</p>");
            var humidityOne = $("<p>" + "Humidity: " + listItem.main.humidity + "‎ %" + "</p>");
            $("#day" + item).append(dateOne, iconOne, tempOne, humidityOne);
        });
    });
}

//localstorage & adding buttons
function createNsaveBtn() {
    existing = localStorage.getItem('city');
    existing = existing ? existing.split(',') : [];
    if (city) { existing.unshift(city); }
    localStorage.setItem('city', existing.toString());
    existing.forEach(function(item) {
        newCityBox = $('<div class=' + item + 'box >').attr("id", "citybox");
        newCityBtn = $('<button>').attr("id", "city").attr("data-name", item);
        deleteBtn = $('<button>').attr("id", "remove").attr("data-name", item);
        deleteBtn.append($('<i class="far fa-trash-alt"></i>'));
        (newCityBtn).text(item.charAt(0).toUpperCase() + item.substring(1));
        $("#buttons-view").append(newCityBox);
        newCityBox.append(newCityBtn, deleteBtn);
    })
}
createNsaveBtn();
//event listener for created buttons
$(document).on("click", "#city", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    city = event.target.getAttribute('data-name');
    displayWeather();
    forecastValues();
});

$(document).on("click", "#remove", function(event) {
    event.preventDefault();
    city = event.target.getAttribute('data-name');
    var string = localStorage.getItem('city');
    if (string.includes(city + ",")) {
        string = string.replace(city + ",", "");
    } else if (string.includes("," + city)) {
        string = string.replace("," + city, "")
    } else string.replace(city, "");
    localStorage.setItem("city", string);
    $("." + city + "box").empty();
});

//event listener for submit buttons
$("#add-city").on("click", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    city = $("#city-input").val().trim();
    displayWeather();
    forecastValues();
    $("#buttons-view").empty();
    createNsaveBtn();
});
$("#current-city").on("click", function(event) {
    event.preventDefault();
    jQuery(document).ready(function($) {
               $.ajax({
            url: "https://geolocation-db.com/jsonp",
            jsonpCallback: "callback",
            dataType: "jsonp",
            success: function(location) {
                var currentCity = location.city;

        city = currentCity;
        displayWeather();
        forecastValues();

    });
});
