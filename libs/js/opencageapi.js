export {getNameCountry as default};
export {getNameCountryBtn};

//method on load return core info for user current lat/long country
//takes as parameters lat/longitude. use API opencage to take the data as
//country code, name of the user city, name of the country, currrency code and currency name
//retur Promise with array of all core data
let getNameCountry = (coordinates) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "libs/php/nameCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
          lat: coordinates['position'][0]['latitude'],
          lng: coordinates['position'][0]['longitude']
        },
        success: function(response) {
            //console.log(response);
            //successful resonse
          if (response.status.name == "ok") {
              //holds country code
              let codeCountry = response.data[0]['components']['ISO_3166-1_alpha-2'];
              //holds city name
              let nameCity = response.data[0]['components']['city'];
              //holds country 
              let nameCountry = response.data[0]['components']['country'];
              //holds currency code
              let currencyCountryCode = response.data[0]['annotations']['currency']['iso_code'];
              //holds currency name
              let currencyName = response.data[0]['annotations']['currency']['name'];
              resolve([coordinates,codeCountry,nameCity,nameCountry,currencyCountryCode,currencyName]);
          }
        },
        error: function (error) {
            reject(error)
        }
      })
    })
}

  //method on click return core info for selected country
  //takes as parameters country name use API opencage to take the data as
  //country code, name of the country, currrency code and currency name
  //retur Promise with array of all core data
  let getNameCountryBtn = (data) => {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: "libs/php/nameCountryBtn.php",
          type: 'POST',
          dataType: 'json',
          data: {
            country: data[0]
          },
          success: function(response) {
              //console.log(response);  
            //successful resonse 
            if (response.status.name == "ok") {
                //holds country code
                let codeCountry = response.data[0]['components']['ISO_3166-1_alpha-2'];
                //let nameCity = response.data[0]['components']['city'];
                //holds country
                let nameCountry = response.data[0]['components']['country'];
                //holds currency code
                let currencyCountryCode = response.data[0]['annotations']['currency']['iso_code'];
                //holds currency name
                let currencyName = response.data[0]['annotations']['currency']['name'];
                resolve([codeCountry,nameCountry,currencyCountryCode,currencyName]);
            }
          },
          error: function (error) {
              //console.log(error);
              reject(error)
          }
        })
      })
             
    }//getNameCountry
 