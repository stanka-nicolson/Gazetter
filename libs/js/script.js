import getselectMenu from './selectMenu.js';
import  getNameCountry from './opencageapi.js'; 
import  {getNameCountryBtn} from './opencageapi.js';
import  getcountryInfo from './geonames.js'; 
import  {getWikiLinks,getEarthquaces,getcountryInfoBtn} from './geonames.js';
import  getcountryFlag from './restCountries.js'; 
import  {getcountryFlagBtn} from './restCountries.js'; 
import  getWeather from './openweather.js';
import  {getWeatherBtn} from './openweather.js'; 
import  getExchangeRates from './openExchangeRates.js';
import  {getExchangeRatesBtn} from './openExchangeRates.js';
let mymap;
//initilize group of geojson layer
let group;
group = new L.featureGroup();
let firstBorderLayer;
let selectListCountryLayer;
let secondBorderLayer;
let marker;
let bounds;
let southWest;
let northEast;
let markerClast;
let flagMarker;
let locationEasyBut;
let modalEasyButton;  
let current_position;
let current_accuracy;
let layer1;

//peloader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
        });
    }
});

$(document).ready(function() {
    
    //get all corners of the main map
    southWest = L.latLng(-89.98155760646617, -180);
    northEast = L.latLng(89.99346179538875, 180);
    bounds = L.latLngBounds(southWest, northEast);
    
    //set the tiles of terrian layer map
    let JawgTerrain = L.tileLayer('https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        //attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
        subdomains: 'abcd',
        accessToken: 'UgwC5A0JxX5WRMy1sQAZKGYhwLV9VMAUMGU1NtusCGqSi2dHjvdU6CopDQ9qyNq8'
    });

    //transport layer
    let ThunderforestTransport = L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apikey}', {
	//attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '778eb3847f2a430e921c6ff8b36842cb',
	noWrap: true,
    //subdomains: 'abcd',
    });

    //cycling tiles
    let ThunderforestOpenCycleMap = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={apikey}', {
	//attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '778eb3847f2a430e921c6ff8b36842cb',
	noWrap: true
    });

    //set the map layout
    mymap = L.map('mapid', {
        minZoom: 3,
        maxZoom: 18,
        //zoomControl: true,
        maxBounds: bounds,
        layers: JawgTerrain
    }).setView([51.39920565355378, -14.25647273271988],2);

    addControlPlaceholders(mymap);
    mymap.zoomControl.setPosition('topleft');

    //put the tile layer to map
    mymap.addLayer(JawgTerrain);
    mymap.on('drag', function() { 
        mymap.panInsideBounds(bounds, { animate: false }); 
    });

    //create cluster for markers in groups
    markerClast = new L.markerClusterGroup({
        chunkedLoading: true,
        //singleMarkerMode: true,
        spiderfyOnMaxZoom: false
    });

    /*
    markerClast = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false
    });
    */
    //create icon/image for markers airports as plane
    flagMarker = L.icon({
            iconUrl: 'img/plane7.png',
            iconSize: [24, 28],
            iconAnchor: [9, 21],
            popupAnchor: [0, -14]
    }); 

    //set airports on map from json file
    fetch('vendors/json/airports.json')
        .then(response =>{
            console.log(response);
            return response.json();
        })
        .then(data =>{
            //console.log(data);
            for(let item in data){
                
              //popup contain data from jsonfile
                let popups = '<spam class="popup title">' + data[item]['name'] + '</spam>' +
                '<br />' + data[item]['city'] +
                '<br />' + data[item]['country'] +
                '<br /><spam class="popup">IATA: </spam>' + data[item]['iata'] +
                '<br /><spam class="popup">ICAO: </spam>' + data[item]['icao'];

                //set them as markers
                marker = L.marker([data[item]['latitude'], data[item]['longitude']], {icon: flagMarker})
                            .bindPopup(popups);
                //add to cluster gropu
                markerClast.addLayer(marker);
            } 
        })
        .catch(error =>{
            //console.log('error');
            console.error(error);
        });

    //initilize feature group with clusters
    let fg = new L.featureGroup([markerClast]);
    fg.addTo(mymap);

    //set three types maps terrian, transport and cycle
    let baseMaps = {
        "Streets": JawgTerrain,
        "Transport": ThunderforestTransport,
        "Cycle": ThunderforestOpenCycleMap
    };

    layer1 = new L.control.layers(baseMaps, null, {position: 'topright'});
    layer1.addTo(mymap);
    
    //modal Easy button
    modalEasyButton = new L.easyButton({
        position: 'verticalcenterright', 
        states: [{
            stateName: 'add modal',
            //icon: 'fa-location-arrow',
            icon: 'fa fa-info',
            onClick: function(){

                setTimeout(function(){
                    $("#myModal").modal('show');
                },1000);//set interval to 1 second
            
                //get the borders arount the country
                let getCountrySelectBtn = () =>{
                    return new Promise((resolve, reject) => {
                        let countryName;
                        let countryCode;
                        //get selected country code
                        let countryData = $('#selCountry').val();
                        $.ajax({
                            url: 'libs/php/countryNameSelectMenu.php',
                            type: 'POST',
                            dataType: 'json',
                            data: { countryData: countryData },
                            success: function(result) {
                              //console.log('success');
                                console.log(result['data']);
                               if (result.status.name == "ok") {
                                countryName = result['data']['name'];
                                countryCode = result['data']['iso_a2']; 
                                console.log("111: " + countryName);
                                console.log("222: " + countryCode);
                                resolve([countryName,countryCode]);
                               }
                               
                            },
                            error: function (error) {
                                //console.log(error);
                                reject(error);
                                //console.log("Error: " + error + ", 1: " + JSON.stringify(jqXHR) +" 2: " + textStatus);
                            }
                        })

                        });
                }

                async function getDataBtn() {
                    try{
                        //let response = await fetch('vendors/json/countryBorders.geo.json');
                        //let commit = await response.json();
                        let countryBtn = await getCountrySelectBtn(); //work
                        let nameCountryBtn = await getNameCountryBtn(countryBtn); 
                        let countryInfoBtn = await getcountryInfoBtn(nameCountryBtn);
                        let countryFlagBtn = await getcountryFlagBtn(nameCountryBtn);
                        let wikiLinksBtn = await getWikiLinks(countryInfoBtn); 
                        let weatherBtn = await getWeatherBtn(nameCountryBtn);
                        let exchangeRatesBtn = await getExchangeRatesBtn(nameCountryBtn);
                        let earthquacesBtn = await getEarthquaces(countryInfoBtn);
                    }catch(error){
                        console.log(error);
                    }
                }

                getDataBtn();
            }//onClick
        }]
    });

    modalEasyButton.addTo(mymap);

    //user current possition marker easyButton
    function onLocationFound(e) {
        if (current_position) {
            mymap.removeLayer(current_position);
            mymap.removeLayer(current_accuracy);
        }
        var radius = e.accuracy;
      
        current_position = L.marker(e.latlng).addTo(mymap)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
      
        current_accuracy = L.circle(e.latlng, radius).addTo(mymap);
    }
      
    function onLocationError(e) {
        alert(e.message);
    }
      
    mymap.on('locationfound', onLocationFound);
    mymap.on('locationerror', onLocationError);
      
    //easyButton
    locationEasyBut = new L.easyButton({
        position: 'verticalcenterright',
        states: [{
            stateName: 'addLocation',
            icon: 'fa-map-marker',
            title: 'add user location',
            onClick: function(control){
                mymap.locate({setView: true, maxZoom: 16});
                control.state('removeLocation');
                }
            }, {
            stateName: 'removeLocation',
            icon: 'fa-undo',
            title: 'remove user location',
            onClick: function(control){
                mymap.removeLayer(current_position);
                mymap.removeLayer(current_accuracy);
                mymap.setView([51.39920565355378, -14.25647273271988],2);
                control.state('addLocation'); 
                }
            }]
    });
      
    locationEasyBut.addTo(mymap);


    //get latitude and logitude method and return them as promise object
    let getCoordinates = () => {
        return new Promise((resolve, reject) => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude
                let long = position.coords.longitude
                let coordinates = {
                        position:[
                            {latitude: lat, 
                            longitude: long}
                        ]};
                resolve(coordinates)
            })
            } else {
            reject("your browser doesn't support geolocation API")
            } 
        }); 
    }

    //add feature group withy json layer to the map
    group.addTo(mymap);
    //set the borders arount the country as pass data from contryBorders and 
    //country code 
    let getCountryBorderds = (coordinates) =>{
        return new Promise((resolve, reject) => {
            let countryCode = coordinates[1];
            $.ajax({
                url: 'libs/php/bordersCountry.php',
                type: 'POST',
                dataType: 'json',
                data: { countryCode: countryCode },
                success: function(result) {
                  //console.log('success');
                    console.log(result['data']);
                   if (result.status.name == "ok") {
                    firstBorderLayer = new L.geoJSON(result['data'], {
                        style: {color: "#ff0000",weight: 2, fillOpacity: 0}
                        });
                        group.addLayer(firstBorderLayer); 
                        mymap.fitBounds(group.getBounds()); 
                   }
                   resolve(coordinates);
                },
                error: function (error) {
                    //console.log(error);
                    reject(error);
                    //console.log("Error: " + error + ", 1: " + JSON.stringify(jqXHR) +" 2: " + textStatus);
                }
            })
        });
    }

    $('#selCountry').on('change', function(){
        let selectedCountry = $(this).val();
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'libs/php/bordersCountrySelectMenu.php',
                type: 'POST',
                dataType: 'json',
                data: { selectedCountry: selectedCountry },
                success: function(result) {
                  //alert('success');
                    console.log(result['data']);
                   // alert(result['data']);
                   if (result.status.name == "ok") {
                    selectListCountryLayer = new L.geoJSON(result['data'], {
                        style: {color: "#ff0000",weight: 2, fillOpacity: 0}
                    });

                        //clear all borders layer
                        //group.clearLayers();
                        group.eachLayer(function (layer) {
                        group.removeLayer(layer);
                        });

                        group.addLayer(selectListCountryLayer);
                        mymap.fitBounds(selectListCountryLayer.getBounds());
                        }
                   resolve(`Success`);

                },
                error: function (error) {
                    //console.log(error);
                    reject(error);
                    //console.log("Error: " + error + ", 1: " + JSON.stringify(jqXHR) +" 2: " + textStatus);
                }
            })
        });



    });   


     //sync function run all methods in order
     async function getData() {
       try{
        let selectMenu = await getselectMenu();
        //let dataList = await getdataList();
        let coordLatLong = await getCoordinates();
        let nameCountry = await getNameCountry(coordLatLong);
        //let response = await fetch('vendors/json/countryBorders.geo.json');
        //let commit = await response.json();
        let borders = await getCountryBorderds(nameCountry);
        //let markersCountry = await getMarkersCountry(nameCountry); 
        let countryInfo = await getcountryInfo(nameCountry); 
        let countryFlag = await getcountryFlag(nameCountry);
        let wikiLinks = await getWikiLinks(countryInfo); 
        let weather = await getWeather(nameCountry);
        let exchangeRates = await getExchangeRates(nameCountry );
        let earthquaces = await getEarthquaces(countryInfo);
        }catch(error){
            console.log(error);
        }
     }
 
     getData();
    
 });//onload
 


/*on load functions*/ 

// Create additional Control placeholders for easy buttons
function addControlPlaceholders(map) {
    var corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide + hSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenter', 'left');
    createCorner('verticalcenter', 'right');
}


/*
//select menu
let getselectMenu = () => {
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
                   //console.log("Select menu key: " + key);
                   //console.log("SElect menu value: " + value);
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
*/


  /*opencageapis*/ 
  //method on load return core info for user current lat/long country
//takes as parameters lat/longitude. use API opencage to take the data as
//country code, name of the user city, name of the country, currrency code and currency name
//retur Promise with array of all core data
/*
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
*/

/*
//markers on load country
let getMarkersCountry = (coordinates) => {
    return new Promise((resolve, reject) => {
    let countryCode = coordinates[1];
    console.log("Marcers: " + countryCode);
    $.ajax({
        url: "libs/php/markersCountry.php",
        type: 'POST',
        dataType: 'json',
        data: { countryCode: countryCode },
        success: function(response) {
            console.log(response);
            //successful resonse
          if (response.status.name == "ok") {
              
          }
        },
        error: function (error) {
            reject(error)
        }
      })
    })
}
*/
  //method on click return core info for selected country
  //takes as parameters country name use API opencage to take the data as
  //country code, name of the country, currrency code and currency name
  //retur Promise with array of all core data
  /*
  let getNameCountryBtn = (data) => {
      let country = data[0];
      return new Promise((resolve, reject) => {
        $.ajax({
          url: "libs/php/nameCountryBtn.php",
          type: 'POST',
          dataType: 'json',
          data: { country: country },
          success: function(response) {
              console.log(response);  
            //successful resonse 
            if (response.status.name == "ok") {
                //holds country code
                let codeCountry = response.data[0]['components']['ISO_3166-1_alpha-2'];
                //holds country
                let nameCountry = response.data[0]['components']['country'];
                //holds currency code
                let currencyCountryCode = response.data[0]['annotations']['currency']['iso_code'];
                //holds currency name
                let currencyName = response.data[0]['annotations']['currency']['name'];
                console.log("Code: " + codeCountry  + "Country: " + nameCountry + "Currency: " 
                +currencyCountryCode + "Currency name: " + currencyName);
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
 */

/*geonames apis*/ 
//get basic country info method with API geonames
 //takes for apamethers core data from getNameCountry() country code
 //display the data with country name, continent, capital, population and area
 //return Promise array with country name and south, west, north and est corners of the country
 //which will be used in getWikilinks()
 /*
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
*/

/*
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
*/

/*
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
*/

  //get basic country info method with API geonames on click btn
 //takes for apamethers core data from getNameCountry() country code
 //display the data with country name, continent, capital, population and area
 //return Promise array with country name and south, west, north and est corners of the country
 //which will be used in getWikilinks()
 /*
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
*/
/*open Exchange rates apis*/ 
//get exchange rates
/*
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
*/

/*
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
*/

/*open weather apis*/
//get weather information passed paramether city name
//API openweather
/*
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
*/

//get weather on click btn paramether passed is country name
/*
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
*/

  /*rest countries apis */
  //get country flag and language pass paramether country code
//API restcountry 
/*
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
*/
//get country flag and language pass paramether country code on click btn
//API restcountry 
/*
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
*/
