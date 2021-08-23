<?php
	//URL-encode according to RFC 3986 and Encodes an ISO-8859-1 string to UTF-8 to
	//pass it to url
    $country = rawurlencode(utf8_encode($_POST['countryCode']));
    
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => 'https://airportix.p.rapidapi.com/airport/country_code/'.$country.'/%7Bclassification%7D',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: airportix.p.rapidapi.com",
            "x-rapidapi-key: 95a9735ce0msh6b08b92de1de7dep12edf5jsn4eeae907ddf6"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }

    /*
	$decode = json_decode($response,true);	
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output); 
    */
?>