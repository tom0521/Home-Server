<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Content-Type,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Transaction_Tag.php';

    $database = new Database();
    $db = $database->connect();

    $transaction_tag = new Transaction_Tag($db);

    $data = json_decode(file_get_contents("php://input"));

    $transaction_tag->transaction_id = $data->transaction_id;
    $transaction_tag->tag_id = $data->tag_id;

    if($transaction_tag->create()){
        echo json_encode(
            array(
                'transaction_id' => $transaction_tag->transaction_id,
                'tag_id' => $transaction_tag->tag_id
            )
        );
    } else {
        echo json_encode(
            array('message' => 'Transaction Not Tagged')
        );
    }