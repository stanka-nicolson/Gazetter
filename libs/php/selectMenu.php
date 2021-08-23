<?php
//read the data from file json 
$countryJsonFileContent = file_get_contents('../../vendors/json/countryBorders.geo.json');
//take json content and convert it to array
$array = json_decode($countryJsonFileContent, true);
//inilize sorted array by counties name/key
$sortCountries=array();
//loop and each country
    foreach($array['features'] as $country){
   //name of the country
   $name = $country['properties']['name']; 
   $code = $country['properties']['iso_a2'];
   //country names as key and iso_a2 as value
   $sortCountries[$name] = $code;
  //sort the array asc by key/country names
    ksort($sortCountries);
 }
 
  $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['data'] = $sortCountries;
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output); 
?>  
