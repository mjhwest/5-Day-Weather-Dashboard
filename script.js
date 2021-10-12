var weatherAPI = "81bba03d80a285cb4521ac469ecbb174";

var city;

// var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPI}`




function currentWeather(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${adelaide}&units=imperial&appid=${weatherAPI}`
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function(weather) {
        console.log('Ajax Response \n-------------');
        console.log(response);
    });

}