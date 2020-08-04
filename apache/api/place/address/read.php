<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../../config/Database.php';
    include_once '../../../models/Address.php';

    $database = new Database();
    $db = $database->connect();

    $address = new Address($db);
    $address->place_id = isset($_GET['place_id']) ? $_GET['place_id'] : die();
    $result = $address->read_place();
    $num = $result->rowCount();

    if($num > 0){
        $address_arr = array();
        $address_arr['data_length'] = $num;
        $address_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $address_itme = array(
                'address_id' => $address_id,
                'place_id' => $place_id,
                'address' => $address,
                'address2' => $address2,
                'city_id' => $city_id,
                'postal code' => $postal_code,
                'phone' => $phone,
                'url' => $url
            );

            array_push($address_arr['data'], $address_item);
        }

        echo json_encode($address_arr);
    } else {
        echo json_encode(
            array('message' => 'No Addresses Found for Place ' . $address->place_id)
        );
    }