// var weatherAPI = "81bba03d80a285cb4521ac469ecbb174"; re use this key tomorrow, currently over limit
var weatherAPI = "9e0ede6ed9dad7c9f716f87588160be2";
var cityDetailContainer = $('#weather-container');
var searchButton = $('#button-addon2');
var forecastContainer = $('#day-forecast');
var citySearch = $('#newCity')

var searchLog = []; //not sure if needed 

// run each function on button click
searchButton.on('click', function() {
    let city = $('#newCity').val().toLowerCase();
    let cityList = city.charAt(0).toUpperCase() + city.slice(1);
    fiveDayForecast(city)
    getData(city);
    console.log(city)
    storeCityHistory(cityList);
    $('#searchResult').append(`<li class ="searched" > ${cityList}</li>`)
})


function getData(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPI}`
    console.log(queryURL)
    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            //THIS IS NOT WORKING
            // let currentCol = $(`
            // <div class = "col" id="day-weather">
            // <h3><strong>${data.name}</strong></h3>
            // <p><strong>Temperature:</strong> ${data.main.temp}</p>
            // <p><strong> Humidity: </strong> ${data.main.humidity}</p>
            // <p><strong> Wind Speed: </strong> ${data.wind.speed}</p>
            // </div>
            // `);
            // $('.current').append(currentCol); // Append current weather div to current row


            if ($('.main').length == 0) { //if class=main dosent exist append data 
                //create h3 element for city name an p elements for displaying info 
                let cityName = $("<h3 class='main'>");
                let cityTemp = $("<p>");
                let cityHumidity = $("<p>");
                let cityWind = $("<p>");
                //setting the text of h3 and p
                cityName.text('Currently in ' + data.name)
                cityTemp.text('Tempterature: ' + data.main.temp + 'C')
                console.log(cityTemp.text())
                cityHumidity.text('Humidity: ' + data.main.humidity + '%')
                cityWind.text('Wind Speed: ' + data.wind.speed + 'Km/h')
                    //dynamically appending text
                cityDetailContainer.append(cityName);
                cityDetailContainer.append(cityTemp)
                cityDetailContainer.append(cityHumidity);
                cityDetailContainer.append(cityWind);

                let lon = data.coord.lon;
                let lat = data.coord.lat;
                // uvIndexData(lon, lat)


                //setting the date using unix
                const dayDate = moment.unix(data.dt).format("dddd, MMMM Do YYYY")
                console.log(dayDate)


                //creating variable to display current weather icon
                var iconCode = data.weather[0].icon;
                var iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;

                cityName.append(': ' + dayDate)
                cityName.after(`<img src="${iconURL}" class"icon-img" alt="icon image">`)
                uvIndexData(lon, lat)
                    // console.log('does exist')
            } else { //if it does exist, 
                cityDetailContainer.empty();
                getData(city)
                console.log('does not exist')
                console.log(city)
            }
        });
}

//function to display UV index: 
function uvIndexData(lon, lat) {
    var uvAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherAPI}`
    fetch(uvAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data)
            console.log(data.current.uvi);
            //create p element to display UVI
            const uvi = $('<p>UV Index:</p>')
                // const span, target text into a string, math.floor rounds uvindex to single figure.
            const span = $('<span>' + Math.round(data.current.uvi) + '</span>')
                //apply .index-scale to UV index......i want the uvScale to cover the uvi text
            var uvScale = $("<div class='index-scale'>")
                //append to correct locatoin
            cityDetailContainer.append(uvi);

            // If statement to check the uv index and colour the indicator accordingly
            if (data.current.uvi <= 2) {
                // console.log('low')
                span.addClass('low');
            } else if (data.current.uvi > 2 && data.current.uvi <= 5) {
                // console.log('medium')
                span.addClass('medium');
            } else if (data.current.uvi > 5 && data.current.uvi <= 7) {
                // console.log('high')
                span.addClass('high')
            } else if (data.current.uvi > 7 && data.current.uvi <= 10) {
                // console.log('very-high')
                span.addClass('very-high')
            } else {
                // console.log('dangerous')
                span.addClass('dangerous')
            }
            uvi.append(span);
            uvScale.append(uvi);
            cityDetailContainer.append(uvScale)
        })
}

//create function for 5 day forecast. 
function fiveDayForecast(city) {
    var forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${weatherAPI}`
    fetch(forecast)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data)
                // let count = 0; // start a count to increment with each forecast day

            if ($('#day-forecast').length == 0) {
                for (var i = 0; i < data.list.length; i++) {
                    var dayData = data.list[i]
                    if (dayData.dt_txt.includes("03:00")) {
                        console.log(dayData.dt_txt)
                        var unixDate = moment.unix(dayData.dt).utc().format("dddd, MMMM Do YYYY")
                        console.log(unixDate)
                        var iconCode = dayData.weather[0].icon;
                        var iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;

                        // create each section to append daily weather details
                        let weatherCol = $(`
                            <div class="col mx-3" id="day-forecast">
                                <h4><strong> ${unixDate}</strong> <img src = "${iconURL}" class ="icon-ig" alt = "weahter-icon"></h4> 
                                <p><strong>Temperature: ${dayData.main.temp}</p>
                                <p><strong>Humidity:</strong> ${dayData.main.humidity}</p>
                                <p><strong>Wind Speed:</strong> ${dayData.wind.speed}</p>
                            </div>
                        `);
                        $('.weather').append(weatherCol);
                        // Append weather div to weather row
                    }
                }
                let forecastText = "<h2> Five Day Forecast </h2>"
                $('.weather').prepend(forecastText);
            } else {
                $('.weather').empty();
                fiveDayForecast(city);
            }
        })
}


//function to store city search in local storage. 
function storeCityHistory(data) {
    if (data) {
        var old = localStorage.getItem('city');
        if (old === null) old = ''; //if nothing in local storage 
        if (old.indexOf(data) == -1) { //not letting you add the same city twice 
            localStorage.setItem('city', old + ', ' + data)
        }
    }

}

//create function to render to #search-result 
function addSearch() {
    var local = localStorage.getItem('city')
    if (local === null) local = '';
    var localArray = local.split(', ');

    for (var i = 0; i < localArray.length; i++) {
        if (localArray[i] == '') {
            $('.searched').addClass('hide')
        } else {
            $('#searchResult').append(`<li class ="searched" > ${localArray[i]}</li>`)
        }

    }
}
addSearch();




//create function to hide weather containers unless clicked on 
//create function to remove old weather and replace with new search result 
function displayOld() {
    var oldResults = $('.searched')
    oldResults.each(function(index, result) {
        $(this).on('click', function() {
            var city = $(this).text()
            getData(city)
            fiveDayForecast(city)
            console.log(city)

        })

    })
}

displayOld();