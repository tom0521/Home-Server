<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Content-Type,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/City.php';

    $database = new Database();
    $db = $database->connect();

    $city = new City($db);

    $data = json_decode(file_get_contents("php://input"));

    $city->city = $data->city;
    $city->state = $data->state;

    if($city->create()){
        echo json_encode(
            array(
                'city_id' => $city->city_id,
                'city' => $city->city,
                'state' => $city->state
            )
        );
    } else {
        echo json_encode(
            array('message' => 'City Not Created')
        );
    }