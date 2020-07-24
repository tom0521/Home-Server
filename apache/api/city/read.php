<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/City.php';

    $database = new Database();
    $db = $database->connect();

    $city = new City($db);
    $result = $city->read();
    $num = $result->rowCount();

    if($num > 0){
        $city_arr = array();
        $city_arr['data_length'] = $num;
        $city_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $city_item = array(
                'city_id' => $city_id,
                'city' => $city,
                'state' => $state
            );

            array_push($city_arr['data'], $city_item);
        }

        echo json_encode($city_arr);
    } else {
        echo json_encode(
            array('message' => 'No Cities Found')
        );
    }