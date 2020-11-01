$(document).ready(function(){
    console.log("docuemnt loaded");
    // ajax call to open weather api

    // get today's weather for:
        // weather icon??
        // temperature
        // humidity
        // wind speed
        // UV index --> color coded depending on if conditions are favorable, moderate or severe
    // create seperate p elements for each above, and append those to the section with the id #today-weather

    // get 5 day forecast with each of these data points
        // date
        // temp
        // humidity
        // weather icon??
    // create seperate card elements for each date, and append those to the section with the id #five-day-forecast

    // search for a city
        // update city array by prepending to array, store city array perform ajax call
        // limit array length, if too long splice the last value from array

        // click on a city similar to searching for a city

        // on load display last city searched, so if no stored cities, then nothing is shown, otherwise show the city from the array with index 0
})