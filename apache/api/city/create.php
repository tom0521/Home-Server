<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/City.php';

    $database = new Database();
    $db = $database->connect();

    $city = new City($db);

    $data = json_decode(file_get_contents("php://input"));

    $city->city = $data->city;
    $city->state_province = $data->state_province;
    $city->country = $data->country;

    $result = $city->read_single();
    if ($result->numCount() == 0) {
        $city->create();
        $result = $city->read_single();
    }

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
                'state_province' => $state_province,
                'country' => $country
            );

            array_push($city_arr['data'], $city_item);
        }

        echo json_encode($city_arr);
    } else {
        echo json_encode(
            array('message' => 'City Not Created')
        );
    }