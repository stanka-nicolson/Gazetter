 //get basic country info method with API geonames
 //takes for apamethers core data from getNameCountry() country code
 //display the data with country name, continent, capital, population and area
 //return Promise array with country name and south, west, north and est corners of the country
 //which will be used in getWikilinks()
  let getcountryInfo = (coordinates) => {
    return new Promise((resolve, reject) => {
        //holds country code
      let countryCode = coordinates[1];
        $.ajax({
            url: "libs/php/countryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {country: countryCode},
            success: function(response) {
                //successful response
                if (response.status.name == "ok") {
                    $('#txtCountry1').html(response['data'][0]['countryName']);
                    $('#txtContinent').html(response['data'][0]['continentName']);
                    $('#txtCountry').html(response['data'][0]['countryName']);
                    $('#txtCapital').html(response['data'][0]['capital']);
                    $('#txtPopulation').html(response['data'][0]['population']);
                    $('#txtArea').html(response['data'][0]['areaInSqKm']);
                    //takes south, north, east and west corners of the country
                    let south = response['data'][0]['south'];
                    let north = response['data'][0]['north'];
                    let east = response['data'][0]['east'];
                    let west = response['data'][0]['west'];
                    let countryName = response['data'][0]['countryName'];
                    //pass data as array
                    resolve([countryName, south, north, east, west]);
                }
            },
            error: function (error) {
                //console.log(error);
                reject(error)
            }

        })
    })
  }

//get wiki links and an image for the country
let getWikiLinks = (data) => {
    return new Promise((resolve, reject) => {
        //holds country name and use API to geonames
      let countryName = data[0];
        $.ajax({
            url: "libs/php/wikiLinks.php",
            type: 'POST',
            dataType: 'json',
            data: {country: countryName},
            success: function(response) {
                //successful response
                if (response.status.name == "ok") {
                    //set the image
                    $('#img').attr("src",response['data'][0]['thumbnailImg']);
                    //set the url link to wikipedia with info about the country
                    $('#wikiLinks').html(response['data'][0]['wikipediaUrl']);
                    $('#wikiLinks').attr({"href": "https://"+response['data'][0]['wikipediaUrl'],
                        "title": response['data'][0]['title']});
          
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

//get earthquakes in order by magnitude in acs the first 5 earthquakes
//use API geoname to take the earthquake data 
let getEarthquaces= (data) => {
    return new Promise((resolve, reject) => {
    //holds the sout/north/east/west corner of the country
      let south = data[1];
      let north = data[2];
      let east = data[3];
      let west = data[4];
  
        $.ajax({
            url: "libs/php/earthquakes.php",
            type: 'POST',
            dataType: 'json',
            data: {south: south,
                    north: north,
                    east: east,
                    west: west
            },
            success: function(response) {
                if (response.status.name == "ok") {
  
    //initilize empty array which will hold the title of the table
     let col = [];
     // Extract value from table header
     for(let item in response['data']){
        for(let i in response['data'][item]){
            if (col.indexOf(i) === -1) {
                if(i == 'datetime' || i == 'magnitude'){
                    //push datetime and magnitude as title in array
                    col.push(i);
                }
            }
        }
     }
    
     // Create a table
     let table = document.createElement("table");
     //set class to th
     table.setAttribute('class','table table-striped');
     // Create table header row using the extracted headers above
     // table row
     let tr = table.insertRow(-1);                   
     
     for (let i = 0; i < col.length; i++) {
        // table header
        let th = document.createElement("th");      
        th.setAttribute('class','col-6 col-md-4 col-ld-2');
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
  
     // add json data to the table as rows.
     for (let i = 0; i < response['data'].length; i++) {
         tr = table.insertRow(-1);
         
         for (let j = 0; j < col.length; j++) {
             let tabCell = tr.insertCell(-1);
             tabCell.innerHTML = response['data'][i][col[j]];
         }
     }
     //add the newly created table with json data, to a container.
    const divShowData = document.getElementById('earthQuaces');
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
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

  //get basic country info method with API geonames on click btn
 //takes for apamethers core data from getNameCountry() country code
 //display the data with country name, continent, capital, population and area
 //return Promise array with country name and south, west, north and est corners of the country
 //which will be used in getWikilinks()
  let getcountryInfoBtn = (data) => {
    return new Promise((resolve, reject) => {
        //holds country code
        let countryCode = data[0];
        $.ajax({
            url: "libs/php/countryInfoBtn.php",
            type: 'POST',
            dataType: 'json',
            data: {country: countryCode},
            success: function(response) {
                if (response.status.name == "ok") {
                    $('#txtCountry1').html(response['data'][0]['countryName']);
                    $('#txtContinent').html(response['data'][0]['continentName']);
                    $('#txtCountry').html(response['data'][0]['countryName']);
                    $('#txtCapital').html(response['data'][0]['capital']);
                    $('#txtPopulation').html(response['data'][0]['population']);
                    $('#txtArea').html(response['data'][0]['areaInSqKm']);
                    let south = response['data'][0]['south'];
                    let north = response['data'][0]['north'];
                    let east = response['data'][0]['east'];
                    let west = response['data'][0]['west'];
                    let countryName = response['data'][0]['countryName'];
                    resolve([countryName, south, north, east, west]);
                }
            },
            error: function (error) {
                reject(error)
            }

        })
    })
}
  export {getcountryInfo as default};
  export {getWikiLinks,getEarthquaces,getcountryInfoBtn};