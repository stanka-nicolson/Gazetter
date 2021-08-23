//get weather information passed paramether city name
//API openweather
let getWeather = (data) => {
    return new Promise((resolve, reject) => {
    //city name of the user
      let cityName = data[2];
        $.ajax({
            url: "libs/php/weather.php",
            type: 'POST',
            dataType: 'json',
            data: {city: cityName},
            success: function(response) {
                if (response.status.name == "ok") {
                    let celsius = response['data']['main']['temp'];
                    //calculate fahrenheit 
                    let fahrenheit = (celsius) => {
                        return celsius * 9 / 5 + 32;
                    }

                    $('#temp').html(Math.round(response['data']['main']['temp']) + '<sup>o</sup>C / ' + Math.round(fahrenheit(celsius)) + '<sup>o</sup>F');
                    $('#feelsLike').html(Math.round(response['data']['main']['feels_like']) + '<sup>o</sup>C / ' + Math.round(fahrenheit(celsius)) + '<sup>o</sup>F');
                    $('#tempMin').html(Math.round(response['data']['main']['temp_min']) + '<sup>o</sup>C / ' + Math.round(fahrenheit(celsius)) + '<sup>o</sup>F');
                    $('#tempMax').html(Math.round(response['data']['main']['temp_max']) + '<sup>o</sup>C / ' + Math.round(fahrenheit(celsius)) + '<sup>o</sup>F');
                    $('#descr').html(response['data']['weather'][0]['description']);

                    resolve(`Success`);
                }
            },
            error: function (error) {
                //console.log(error);
                reject(error)
            }
  
        })
    })
  }

//get weather on click btn paramether passed is country name
let getWeatherBtn = (data) => {
    return new Promise((resolve, reject) => {
    //country name
      let countryName = data[1];
        $.ajax({
            url: "libs/php/weatherBtn.php",
            type: 'POST',
            dataType: 'json',
            data: {country: countryName},
            success: function(response) {
                //success response
                if (response.status.name == "ok") {

                    let celsius = response['data']['main']['temp'];
                     //calculate fahrenheit 
                    let fahrenheit = (celsius) => {
                        return celsius * 9 / 5 + 32;
                    }
                    $('#temp').html(Math.round(response['data']['main']['temp']) + '<sup>o</sup>C / ' + Math.round(fahrenheit(celsius)) + '<sup>o</sup>F');
                    $('#feelsLike').html(Math.round(response['data']['main']['feels_like']) + '<sup>o</sup>C / ' + Math.round(fahrenheit(celsius)) + '<sup>o</sup>F');
                    $('#tempMin').html(Math.round(response['data']['main']['temp_min']) + '<sup>o</sup>C / ' + Math.round(fahrenheit(celsius)) + '<sup>o</sup>F');
                    $('#tempMax').html(Math.round(response['data']['main']['temp_max']) + '<sup>o</sup>C / ' + Math.round(fahrenheit(celsius)) + '<sup>o</sup>F');
                    $('#descr').html(response['data']['weather'][0]['description']);

                    resolve(`Success`);
                }
            },
            error: function (error) {
                //console.log(error);
                reject(error)
            }
        })
    })
  }

  export {getWeather as default};
  export {getWeatherBtn};