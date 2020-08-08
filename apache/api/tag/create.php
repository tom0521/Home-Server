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

    if($tag->create()){
        echo json_encode(
            array(
                'tag_id' => $tag->tag_id,
                'tag' => $tag->tag
            )
        );
    } else {
        echo json_encode(
            array('message' => 'Tag Not Created')
        );
    }