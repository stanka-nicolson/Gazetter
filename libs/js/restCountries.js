//get country flag and language pass paramether country code
//API restcountry 
let getcountryFlag = (coordinates) => {
    return new Promise((resolve, reject) => {
        //country code
      let countryCode = coordinates[1];
        $.ajax({
            url: "libs/php/countryFlag.php",
            type: 'POST',
            dataType: 'json',
            data: {country: countryCode},
            success: function(response) {
                if (response.status.name == "ok") {
                    $('#txtLanguage').html(response['data']['languages'][0]['name']);
                    $('#txtFlag').attr("src",response['data']['flag']);
                    
                    resolve(`Success`);
                }
            },
            error: function (error) {
                reject(error)
            }

        })
    })
  }

//get country flag and language pass paramether country code on click btn
//API restcountry 
let getcountryFlagBtn = (coordinates) => {
    return new Promise((resolve, reject) => {
      let countryCode = coordinates[0];
        $.ajax({
            url: "libs/php/countryFlag.php",
            type: 'POST',
            dataType: 'json',
            data: {country: countryCode},
            success: function(response) {
                if (response.status.name == "ok") {
                    $('#txtLanguage').html(response['data']['languages'][0]['name']);
                    $('#txtFlag').attr("src",response['data']['flag']);
                    
                    resolve(`Success`);
                }
            },
            error: function (error) {
                reject(error)
            }
        })
    })
  }

  export {getcountryFlag as default};
  export {getcountryFlagBtn};