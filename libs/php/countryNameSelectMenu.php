<?php
$code = $_POST['countryData'];
//read the data from file json 
$countryJsonFileContent = file_get_contents('../../vendors/json/countryBorders.geo.json');
//take json content and convert it to array
$array = json_decode($countryJsonFileContent, true);
//inilize sorted array by counties name/key
$bordersCountries=array();
//loop and each country
    foreach($array['features'] as $country){
        //name of the country
        //print_r($country);
            if($country['properties']['iso_a2'] == $code){
                $bordersCountries = $country['properties'];
        }
 }

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['data'] = $bordersCountries;
	
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>  