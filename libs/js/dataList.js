let getdataList = () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'libs/php/selectMenu.php',
        type: 'POST',
        dataType: 'json',
        success: function(result) {
            
            if (result.status.name == "ok") {
                $('<option />', {value: "", text: "Select Country"}).appendTo("#selCountry");
                for(let country in result['data']){
                   let key = country;
                   let value = result['data'][country];
                    $('<option />', {value: value, text: key}).appendTo("#selCountry");
                }
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

  export {getdataList as default};