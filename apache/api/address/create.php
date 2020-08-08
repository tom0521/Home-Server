<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Address.php';

    $database = new Database();
    $db = $database->connect();

    $address = new Address($db);

    $data = json_decode(file_get_contents("php://input"));

    $address->place_id = $data->place_id;
    $address->address = $data->address;
    $address->address2 = $data->address2;
    $address->city_id = $data->city_id;
    $address->postal_code = $data->postal_code;
    $address->phone = $data->phone;
    $address->url = $data->url;

    if($address->create()){
        echo json_encode(
            array(
                'address_id' => $address->address_id,
                'place_id' => $address->place_id,
                'address' => $address->address,
                'address2' => $address->address2,
                'city_id' => $address->city_id,
                'postal_code' => $address->postal_code,
                'phone' => $address->phone,
                'url' => $address->url
            )
        );
    } else {
        echo json_encode(
            array('message' => 'Address Not Created')
        );
    }