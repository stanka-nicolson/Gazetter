 //get exchange rates
 let getExchangeRates = (data) => {
    return new Promise((resolve, reject) => {
    //currency code
      let currencyCode = data[4];
      //currency name
      let currency = data[5];
        $.ajax({
            url: "libs/php/exchangeRates.php",
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                //succesful response
                if (response.status.name == "ok") {
                    //loop in the response and find the currency code
                    for(let item in response['data']){
                        if(item == currencyCode){
                        $('#changeRates').html(response['data'][item].toFixed(2) + " " + currency);
                        }
                    }
                    resolve(`success`);
                }
            },
            error: function (error) {
                reject(error)
            }

        })
    })
} 

//get exchange rates on click
let getExchangeRatesBtn = (data) => {
    return new Promise((resolve, reject) => {
      let currencyCode = data[2];
      let currency = data[3];
        $.ajax({
            url: "libs/php/exchangeRatesBtn.php",
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response.status.name == "ok") {
                    for(let item in response['data']){
                        if(item == currencyCode){
                        $('#changeRates').html(response['data'][item].toFixed(2) + " " + currency);
                        }
                    }
                    resolve(`success`); 
                }
            },
            error: function (error) {
                //console.log(error);
                reject(error)
            }
        })
    })
} 

export {getExchangeRates as default};
export {getExchangeRatesBtn};