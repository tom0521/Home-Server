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

    $result = $address->read_single();
    if ($result->rowCount() == 0) {
        $address->create();
        $result = $address->read_single();
    }
    
    $num = $result->rowCount();
    if ($num > 0){
        $address_arr = array();
        $address_arr['data_length'] = $num;
        $address_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $address_item = array(
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
            array('message' => 'Address Not Created')
        );
    }