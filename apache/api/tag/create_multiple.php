<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Content-Type,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Tag.php';

    $database = new Database();
    $db = $database->connect();

    $tag = new Tag($db);

    $data = json_decode(file_get_contents("php://input"));

    $tag_len = 0;
    $tag_arr = array();
    foreach ($data->tags as $tag) {
        $tag->tag = $tag;
        if($tag->create()){
            $tag_len++;
            push($tag_arr, array(
                'tag_id' => $tag->tag_id,
                'tag' => $tag->tag
            ));
        }
    }

    if(empty($tag_arr)){
        echo json_encode(
            array('message' => 'Tag Not Created')
        );
    } else {
        echo json_encode(array(
            'data_length' => $tag_len,
            'data' => $tag_arr));
    }