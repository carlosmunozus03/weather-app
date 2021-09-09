"use strict";
$(document).ready(function () {
// center the map
    var coordinates = {
        lat: 29.4241,
        lng: -98.4936
    }

// This function gets the weather for each day'
// Display the 5 day forecast
    function getWeather(coordinates) {
        $.get('https://api.openweathermap.org/data/2.5/onecall', {
            APPID: WEATHER_MAP_TOKEN,
            lat: coordinates.lat,
            lon: coordinates.lng,
            units: "imperial"
        })
            .done(function (city) {
                console.log(city)
                var displayWeather = '';
                for (var n = 0; n < 5; n++) {
                    var date = city.daily[n];
                    var displayDate = new Date(date.dt * 1000).toDateString();
// String literals with string interpolation
                    displayDate = displayDate.slice(0, displayDate.length - 4)
                    displayWeather += `<div class= "card text-center w-25 m-2 col">`
                    displayWeather += `${displayDate}<br>`
                    displayWeather += `<img class="rounded mx-auto d-block"  src="http://openweathermap.org/img/wn/${city.daily[n].weather[0].icon}@2x.png\n"/>`
                    displayWeather += `<p>${city.daily[n].weather[0].main}<br>`
                    displayWeather += `Hi: ${Math.round(city.daily[n].temp.max)} Lo: ${Math.round(city.daily[n].temp.min)}<br>`
                    displayWeather += `Humidity: ${city.daily[n].humidity}%<br>`
                    displayWeather += `Chance of rain: ${Math.round(city.daily[n].rain)}%<br>`
                    displayWeather += `</p></div>`
                    $('#containerMain').html(displayWeather);
                }
            });
    }

// sets the marker on san antonio by default
    getWeather(coordinates);

// function to capitalize each word
    function capitalize(words) {
        var separateWord = words.toLowerCase().split(' ');
        for (var i = 0; i < separateWord.length; i++) {
            separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                separateWord[i].substring(1);
        }
        return separateWord.join(' ');
    }

// quick search
    function weather(city) {
        var search = city.toString();
        $.get("http://api.openweathermap.org/data/2.5/weather", {
            APPID: WEATHER_MAP_TOKEN,
            q: search,
            units: "imperial"
        }).done(function (data) {
            console.log(data)
            var today = new Date();
            var hours = today.getHours();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            var time = hours + ":" + today.getMinutes() + " " + ampm;
            var displayWeather = "";
            var iconImage = "";
            iconImage += `<img style='margin: auto' class="icon" width="30px" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png\n"/>`
            var clouds = data.weather[0].description;
            var newClouds = capitalize(clouds);

            displayWeather += `<p class="navSearch">`
            displayWeather += `<span class="name">${data.name}:</span>  ${time}&nbsp;&nbsp;&nbsp;  `
            displayWeather += ` Temp: ${Math.round(data.main.temp)}°F&nbsp;&nbsp;&nbsp; `
            displayWeather += `${newClouds}`
            displayWeather += `${iconImage}&nbsp;&nbsp;&nbsp;`
            displayWeather += ` Hi: ${Math.round(data.main.temp_max)}°F Lo: ${Math.round(data.main.temp_min)}°F&nbsp;&nbsp;&nbsp;`
            displayWeather += ` Humidity: ${data.main.humidity}% `
            displayWeather += `</p>`
            $('#navSearch').html(displayWeather);
        });
    }


    var button = document.querySelector('#button')
    button.addEventListener('click', function (e) {
        e.preventDefault();
        var newSearch = document.querySelector('#weatherSearch').value;
        weather(newSearch);
    });
    weather('San Antonio')

// Attatch a map
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    var map = new mapboxgl.Map({
        container: 'map', // container ID
    });
    map.setStyle('mapbox://styles/mapbox/streets-v11')
    map.setZoom(10)
    map.setCenter([-98.4916, 29.4252])
    map.addControl(new mapboxgl.NavigationControl());

//Marker Object
    var marker = new mapboxgl.Marker({
        color: 'red',
    })
        .setLngLat([-98.4861, 29.4260])
        .setDraggable(true)
        .addTo(map);
    marker.on('dragend', function () {
        var lngLat = marker.getLngLat();
        getWeather(lngLat)
    })

    function mapSearch(input) {
        geocode(input, MAPBOX_ACCESS_TOKEN).then(function (results) {
            marker.setLngLat(results);
            map.flyTo({
                center: [results[0], results[1]],
                zoom: 8,
                speed: 1,
                essential: true,
            });
            var newCoords = {
                lat: results[1],
                lng: results[0]
            }
            getWeather(newCoords);
        })
    }

    var button2 = document.querySelector('#btn')
    button2.addEventListener('click', function (e) {
        e.preventDefault();
        var searchResult = document.querySelector('#mapSearch').value;
        mapSearch(searchResult);
        console.log(searchResult)
    });
});