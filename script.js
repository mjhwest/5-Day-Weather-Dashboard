var weatherAPI = "81bba03d80a285cb4521ac469ecbb174";
var cityDetailContainer = $('#weatherDisplayData');
// var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

let city = '';
let searchBtn = $('#button-addon2');
searchBtn.on('click', function() {
    let city = $('#newCity').val().toLowerCase();
    currentWeather(city)
})

function currentWeather(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPI}`
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function(response) {
        console.log('Ajax Response \n-------------');
        console.log(response);
    });

}

function getData() {
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
            cityTemp.text(data.temp)
            cityHumidity.text(data.humidity)
                //cityWind.text(data[i].wind.speed) remove the i as its not in a loop
            cityWind.text(data.wind.speed)
                // cityName.text() = data[i].name;
                // cityTemp.text() = data[i].temp;
                // cityHumidity.text() = data[i].humidity;
                // cityWind.text() = data[i].wind.speed;
                //Appending the dynamically generated html to the div associated with the id="users"
                //Append will attach the element as the bottom most child.
            cityDetailContainer.append(cityName);
            cityDetailContainer.append(cityTemp)
            cityDetailContainer.append(cityHumidity);
            cityDetailContainer.append(cityWind);
        });
}

//Call functions
currentWeather('adelaide');
getData();