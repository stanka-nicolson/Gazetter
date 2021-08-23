<?php
	//URL-encode according to RFC 3986 and Encodes an ISO-8859-1 string to UTF-8 to
	//pass it to url
    $city = rawurlencode(utf8_encode($_POST['city']));
    $key = '';
	$executionStartTime = microtime(true) / 1000;

	$url='http://api.openweathermap.org/data/2.5/weather?q='.$city.'&appid='.$key.'&units=metric';

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
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output); 
?>