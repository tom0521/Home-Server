<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Tag.php';

    $database = new Database();
    $db = $database->connect();

    $tag = new Tag($db);

    $data = json_decode(file_get_contents("php://input"));

    $tag->tag = $data->tag;
    $result = $tag->read_single();
    if ($result->rowCount() == 0) {
        $tag->create();
        $result = $tag->read_single();
    }

    $num = $result->rowCount();
    if($num > 0){
        $tag_arr = array();
        $tag_arr['data_length'] = $num;
        $tag_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $tag_item = array(
                'tag_id' => $tag_id,
                'tag' => $tag
            );

            array_push($tag_arr['data'], $tag_item);
        }

        echo json_encode($tag_arr);
    } else {
        echo json_encode(
            array('message' => 'Tag not created')
        );
    }