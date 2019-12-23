<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Location.php';

    $database = new Database('finances');
    $db = $database->connect();

    $location = new Location($db);
    $result = $location->read();
    $num = $result->rowCount();

    if($num > 0){
        $location_arr = array();
        $location_arr['data_length'] = $num;
        $location_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $location_item = array(
                'id' => $id,
                'name' => $name,
                'address' => $address
            );

            array_push($location_arr['data'], $location_item);
        }

        echo json_encode($location_arr);
    } else {
        echo json_encode(
            array('message' => 'No Locations Found')
        );
    }