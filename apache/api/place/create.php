<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Place.php';

    $database = new Database();
    $db = $database->connect();

    $place = new Place($db);

    $data = json_decode(file_get_contents("php://input"));

    $place->place = $data->place;

    if($place->create()){
        echo json_encode(
            array(
                'place_id' => $place->place_id,
                'place' => $place->place
            )
        );
    } else {
        echo json_encode(
            array('message' => 'Place Not Created')
        );
    }