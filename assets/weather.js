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
var existing = {};
//API calls
function displayWeather() {

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=65bb0a9399a9e35557159693e192db55";

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

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?" + "&APPID=65bb0a9399a9e35557159693e192db55" + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon,
            method: "GET"
        }).then(function(response) {
            uvIndex = $("<p>" + "UV Index: " + response.value + "</p>");
            $(weatherBox).append(uvIndex);
        });

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=65bb0a9399a9e35557159693e192db55",
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
            cityName = $("<h2>" + response.city.name + " " + today + "</h2>");
            cityName.append(icon);
            $(weatherBox).prepend(cityName);
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
        (newCityBtn).text(item.charAt(0).toUpperCase() + item.substring(1));
        $("#buttons-view").append(newCityBox);
        newCityBox.append(newCityBtn);
    })
}
createNsaveBtn();
//event listener for created buttons
$(document).on("click", "#city", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    city = event.target.getAttribute('data-name');
    displayWeather();
});
//event listener for submit buttons
$("#add-city").on("click", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    city = $("#city-input").val().trim();
    displayWeather();
    $("#buttons-view").empty();
    createNsaveBtn();
});