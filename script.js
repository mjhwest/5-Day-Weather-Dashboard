var weatherAPI = "81bba03d80a285cb4521ac469ecbb174";
var cityDetailContainer = $('#weatherDisplayData');
var searchButton = $('#button-addon2');
// var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

let city = '';
let searchBtn = $('#button-addon2');
searchBtn.on('click', function() {
    let city = $('#newCity').val().toLowerCase();
    getData(city)
})

//function to get the current weather for a city 
// function currentWeather(city) {
//     var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPI}`
//     $.ajax({
//         url: queryURL,
//         method: 'GET',
//     }).then(function(currentCityWeather) {
//         console.log(currentCityWeather);

//         $('#weatherDisplayData').css("display", "block");
//         $('#cityDeails').empty();

//     });
// }

//function to display the weather 
function getData(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPI}`
    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            //create h3 element for city name an p elements for displaying info 
            const cityName = $("<h3>");
            const cityTemp = $("<p>");
            const cityHumidity = $("<p>");
            const cityWind = $("<p>");
            //setting the text of h3 and p
            cityName.text(data.name)
            cityTemp.text('Tempterature: ' + data.main.temp + 'C')
            cityHumidity.text('Humidity: ' + data.main.humidity + '%')
            cityWind.text('Wind Speed: ' + data.wind.speed + 'Km/h')
                //Appending the dynamically generated html to the div associated with the id="users"
                //Append will attach the element as the bottom most child.
            cityDetailContainer.append(cityName);
            cityDetailContainer.append(cityTemp)
            cityDetailContainer.append(cityHumidity);
            cityDetailContainer.append(cityWind);
        });
    searchButton.on('click', getData);
}


//function to display UV index: 
// function uvIndexData(city) 
//     var uvAPI = `https://api.openweathermap.org/data/2.5/solar_radiation?lat=${lat}&lon=${lon}&appid=${weatherAPI}`
//     fetch(uvAPI)
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(data) {
//         console.log(data);
//     })

// const lat = data.coord.lat;
// const lon = data.coord.lon; 

//Call functions
// currentWeather('adelaide');
// getData();