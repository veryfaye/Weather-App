$(document).ready(function () {
  var cityArray = [];
  var today = moment().format("L");
  // Divs to append jquery generated data to
  var todayWeather = $("#today-weather");
  var fiveDayForecast = $("#five-day-forecast");

  // search for a city
  $("#submit-city-seach").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#city-search").val().trim();
    console.log(cityName);
    cityArray.unshift(cityName);
    console.log(cityArray)
    localStorage.setItem("cityList", JSON.stringify(cityArray));

    var storedCityArray = JSON.parse(localStorage.getItem("cityList"));
    $("#city-list").prepend($("<li>").attr("class","list-group-item").text(storedCityArray[0]));

    // clear form field
    $("form").trigger("reset");
    // clear divs
    todayWeather.empty();
    fiveDayForecast.empty();

    // update city array by prepending to array, store city array perform ajax call
    // limit array length, if too long splice the last value from array

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=imperial&APPID=4c2327a73f7bc3816d03b00efbb7c4e2";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      // get today's weather for:
      // weather icon??
      var todayWeatherIcon =
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      // temperature, humidity, and wind speed in an array
      var todayArray = [
        "Temperature: " + response.main.temp + " °F",
        "Humidity: " + response.main.humidity + "%",
        "Wind Speed: " + response.wind.speed + " MPH",
      ];
      // create header and img elements for the city name searched, and the current weather img
      var header = $("<h2>").text(cityName + " (" + today + ")");
      var imgEl = $("<img>").attr("src", todayWeatherIcon);
      // add the img to the header so it is inline
      header.append(imgEl);
      // add header to the div with the id #today-weather
      todayWeather.append(header);
      // loop through the todayArray and create a p element for the todays weather
      for (i = 0; i < todayArray.length; i++) {
        var p = $("<p>").text(todayArray[i]);
        todayWeather.append(p);
      }

      // get the latitude and longitude cordinates from the response to be able to get the uv index
      var lat = response.coord.lat;
      var lon = response.coord.lon;

      // create a new url for the uv index ajax call
      var lanLonURL =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=4c2327a73f7bc3816d03b00efbb7c4e2";
      // ajax call to get the uv index
      $.ajax({
        url: lanLonURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        var uvIndex = response.value;
        if (uvIndex <= 2) {
          var uvClass = "bg-success btn-sm";
        } else if (uvIndex <= 5) {
          var uvClass = "bg-warning btn-sm";
        } else {
          var uvClass = "bg-danger btn-sm";
        }
        var span = $("<span>").attr("class", uvClass).text(uvIndex);
        var p = $("<p>").text("UV Index: ");
        p.append(span);
        todayWeather.append(p);
      });

      // get 5 day forecast with each of these data points
      var fiveDayURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=hourly,minutely&units=imperial&appid=4c2327a73f7bc3816d03b00efbb7c4e2";
      $.ajax({
        url: fiveDayURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        for (i = 1; i < 6; i++) {
          // create variables for each text and image piece within the card
          var dailyDate = moment().add(i, "days").format("L");
          var imgIcon =
            "https://openweathermap.org/img/w/" +
            response.daily[i].weather[0].icon +
            ".png";
          var dailyTemp = response.daily[i].temp.day;
          var dailyHumidity = response.daily[i].humidity;
          // create HTML elements for the card, card body, img, and paragraph elements
          var divCard = $("<div>").attr("class", "card col bg-primary m-2");
          var divCardBody = $("<div>").attr("class", "card-body");
          var h4Date = $("<h4>").attr("class", "text-white").text(dailyDate);
          var imgIconEl = $("<img>").attr("src", imgIcon);
          var pTemp = $("<p>")
            .attr("class", "text-white")
            .text("Temp: " + dailyTemp + " °F");
          var pHumidity = $("<p>")
            .attr("class", "text-white")
            .text("Humidity: " + dailyHumidity + "%");
          // append the text and images to the card body
          divCardBody.append(h4Date);
          divCardBody.append(imgIconEl);
          divCardBody.append(pTemp);
          divCardBody.append(pHumidity);
          // append the card body to the card
          divCard.append(divCardBody);
          // append the card to the dive to hold each of the five cards for the forecast
          fiveDayForecast.append(divCard);
        }
      });
    });
  });

  // click on a city similar to searching for a city

  // on load display last city searched, so if no stored cities, then nothing is shown, otherwise show the city from the array with index 0
});
