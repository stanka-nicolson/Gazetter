<?php
    //URL-encode according to RFC 3986 and Encodes an ISO-8859-1 string to UTF-8 to
	//pass it to url
    $country = rawurlencode(utf8_encode($_POST['country']));
    $key = '';
	$executionStartTime = microtime(true) / 1000;

	$url='http://api.geonames.org/wikipediaSearchJSON?formatted=true&q='.$country.'&title='.$country.'&maxRows=1&username='.$key.'&style=full';

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
	$output['data'] = $decode['geonames'];
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output); 
?>