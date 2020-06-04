<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Location.php';

    $database = new Database('finances');
    $db = $database->connect();

    $location = new Location($db);
    $location->id = isset($_GET['id']) ? $_GET['id'] : die();

    $location->read_single();

    $location_arr = array(
        'id' => $location->id,
        'name' => $location->name,
        'address' => $location->address,
        'address_type' => $location->address_type,
        'phone' => $location->phone
    );

    echo json_encode($location_arr);