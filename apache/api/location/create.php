<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
    Access-Control-Allow-Methods,Content-Type,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Location.php';

    $database = new Database('finances');
    $db = $database->connect();

    $location = new Location($db);

    $data = json_decode(file_get_contents("php://input"));

    $location->name = $data->name;
    $location->address = $data->address;

    if($location->create()){
        echo json_encode(
            array(
                'id' => $location->id,
                'name' => $location->name,
                'address' => $location->address
            )
        );
    } else {
        echo json_encode(
            array('message' => 'Location Not Created')
        );
    }