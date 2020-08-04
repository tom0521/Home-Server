<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../../config/Database.php';
    include_once '../../../models/Transaction_Tag.php';

    $database = new Database();
    $db = $database->connect();

    $transaction_tag = new Transaction_Tag($db);
    $transaction_tag->transaction_id = isset($_GET['transaction_id']) ? $_GET['transaction_id'] : die();
    $result = $transaction_tag->read_tag();
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
            array('message' => 'No Tags Found for Transaction ' . $transaction_tag->transaction_id)
        );
    }