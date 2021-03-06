var weatherAPI = "81bba03d80a285cb4521ac469ecbb174";
var cityDetailContainer = $('#weather-container');
var searchButton = $('#button-addon2');
// var forecastContainer = $('#day-forecast');
var citySearch = $('#newCity')

var searchLog = []; //not sure if needed 

// run each function on button click
searchButton.on('click', function() {
    let city = $('#newCity').val().toLowerCase();
    if (!city) {
        return
    }
    let cityList = city.charAt(0).toUpperCase() + city.slice(1);
    fiveDayForecast(city)
    getData(city);
    console.log(city)
    storeCityHistory(cityList);
    $('#searchResult').append(`<li class ="searched" > ${cityList}</li>`)
    $('#weather-container').removeClass("hide");
    $('#forecast-container').removeClass("hide");


})

//create function to get  API data for any city

function getData(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPI}`
    console.log(queryURL)
    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            if ($('.main').length == 0) { //if class=main dosent exist append data 
                //create h3 element for city name an p elements for displaying info 
                let cityName = $("<h3 class='main'>");
                let cityTemp = $("<p>");
                let cityHumidity = $("<p>");
                let cityWind = $("<p>");
                //setting the text of h3 and p
                cityName.text('Currently in ' + data.name)
                cityTemp.text('Tempterature: ' + data.main.temp + '℃')
                console.log(cityTemp.text())
                cityHumidity.text('Humidity: ' + data.main.humidity + '%')
                cityWind.text('Wind Speed: ' + data.wind.speed + 'm/s')
                    //dynamically appending text
                cityDetailContainer.append(cityName);
                cityDetailContainer.append(cityTemp)
                cityDetailContainer.append(cityHumidity);
                cityDetailContainer.append(cityWind);

                //assigning lon and lat with data
                let lon = data.coord.lon;
                let lat = data.coord.lat;
                uvIndexData(lon, lat)



                //setting the date using unix and moment method
                const dayDate = moment.unix(data.dt).format("dddd, MMMM Do YYYY")
                console.log(dayDate)


                //creating variable to display current weather icon
                var iconCode = data.weather[0].icon;
                var iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;

                //append dated next to city name 
                cityName.append(': ' + dayDate)

                //append icon under city name
                cityName.after(`<img src="${iconURL}" class"icon-img" alt="icon image">`)

            } else { //if it does exist, 
                cityDetailContainer.empty();
                getData(city)
                console.log('does not exist')
                console.log(city)
            }
        });
}

//function to display UV index based on Lon and lat data
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
            const uvi = $('<p>UV Index: </p>')
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

            //if statment for 5 day forecast
            if ($('#day-forecast').length == 0) {
                //fir loop to go through all the data
                for (var i = 0; i < data.list.length; i++) {
                    //defining data.list as dayData
                    var dayData = data.list[i]
                        //searching dayData, specifically dt_txt for 03:00, and if its there include it.
                    if (dayData.dt_txt.includes("03:00")) {
                        console.log(dayData.dt_txt)
                            //applying the date 
                        var unixDate = moment.unix(dayData.dt).utc().format("MMM Do YYYY")
                        console.log(unixDate)
                            //applying the weather icon 
                        var iconCode = dayData.weather[0].icon;
                        var iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;

                        // create each section to append daily weather details
                        let weatherCol = $(`
                            <div class="col mx-2" id="day-forecast">
                                <h4><strong> ${unixDate}</strong> <img src = "${iconURL}" class ="icon-ig" alt = "weahter-icon"></h4> 
                                <p><strong>Temp: ${dayData.main.temp}℃ </strong></p>
                                <p><strong>Humidity: ${dayData.main.humidity}%</strong></p>
                                <p><strong>Wind Speed: ${dayData.wind.speed} m/s </strong></p>
                            </div>
                        `);
                        // Append weather div to weather row
                        $('.weather').append(weatherCol);
                    }
                } //setting text for forecast 
                let forecastText = "<h2> Five Day Forecast </h2>"
                    //prepend, put its before the .weather
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
    //get data out of localStorage 
    var local = localStorage.getItem('city')
    if (local === null) local = '';
    //split the array 
    var localArray = local.split(', ');

    //loop, search length of array, if nothing, hide
    for (var i = 0; i < localArray.length; i++) {
        if (localArray[i] == '') {
            $('.searched').addClass('hide')
                //else append 
        } else {
            $('#searchResult').append(`<li class ="searched" > ${localArray[i]}</li>`)
        }
    }
}
addSearch();




//create function to display previously searched weather
function displayOld() {
    var oldResults = $('.searched')
    oldResults.each(function(index, result) {
        $(this).on('click', function() {
            //remove the hide class for containers, so data can be displayed without needing to push search
            $('#weather-container').removeClass("hide");
            $('#forecast-container').removeClass("hide");
            //get contents of getData(city) and fiveDayForecast(city)
            var city = $(this).text()
            getData(city)
            fiveDayForecast(city)
            console.log(city)

        })

    })
}
displayOld();