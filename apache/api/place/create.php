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

    $result = $place->read_single();
    if ($result->rowCount() == 0) {
        $place->create();
        $result = $place->read_single();
    }

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
            array('message' => 'Place Not Created')
        );
    }