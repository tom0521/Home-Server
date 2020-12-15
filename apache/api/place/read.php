<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Place.php';

    $database = new Database();
    $db = $database->connect();

    $place = new Place($db);
    $result = $place->read();
    $num = $result->rowCount();

    if($num > 0){
        $place_arr = array();
        $place_arr['data_length'] = $num;
        $place_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $place_item = array(
                'place_id' => $place_id,
                'place' => $place
            );

            array_push($place_arr['data'], $place_item);
        }

        echo json_encode($place_arr);
    } else {
        echo json_encode(
            array('message' => 'No Places Found')
        );
    }