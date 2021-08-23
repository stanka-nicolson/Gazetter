<?php
//get float value of a variables
    $south = floatval($_POST['south']);
    $north = floatval($_POST['north']);
    $east = floatval($_POST['east']);
    $west = floatval($_POST['west']);

    $key = '';
	$executionStartTime = microtime(true) / 1000;

	$url='http://api.geonames.org/earthquakesJSON?formatted=true&north='.$north.'&south='.$south.'&east='.$east.'&west='.$west.'&maxRows=5&username='.$key.'&style=full';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['earthquakes'];
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output); 
?>