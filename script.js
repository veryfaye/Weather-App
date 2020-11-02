$(document).ready(function () {
  console.log("docuemnt loaded");
  // ajax call to open weather api

  var cityName = "Atlanta";
  var today = moment().format("MM/DD/YYYY");
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
    $("#today-weather").append(header);
    // loop through the todayArray and create a p element for the todays weather
    for (i = 0; i < todayArray.length; i++) {
      var p = $("<p>").text(todayArray[i]);
      $("#today-weather").append(p);
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
      $("#today-weather").append(p);
    });

    // get 5 day forecast with each of these data points
    var fiveDayURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly,minutely&units=imperial&appid=4c2327a73f7bc3816d03b00efbb7c4e2";
    $.ajax({
      url: fiveDayURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      for(i=0;i<5;i++){
          console.log(response.daily[i].temp.day);
          var divCard= $("<div>").attr("class","card col bg-primary m-2")
          var divCardBod = $("<div>").attr("class","card-body").text(response.daily[i].temp.day);
          divCard.append(divCardBod);
          $("#five-day-forecast").append(divCard);
      }
      
      // date
      // temp
      // humidity
      // weather icon??
      // create seperate card elements for each date, and append those to the section with the id #five-day-forecast
    });
  });

  // search for a city
  // update city array by prepending to array, store city array perform ajax call
  // limit array length, if too long splice the last value from array

  // click on a city similar to searching for a city

  // on load display last city searched, so if no stored cities, then nothing is shown, otherwise show the city from the array with index 0
});
