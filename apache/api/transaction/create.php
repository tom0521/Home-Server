<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
    Access-Control-Allow-Methods,Content-Type,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Transaction.php';

    $database = new Database('finances');
    $db = $database->connect();

    $transaction = new Transaction($db);

    $data = json_decode(file_get_contents("php://input"));

    $transaction->date = $data->date;
    $transaction->time = $data->time;
    $transaction->amount = $data->amount;
    $transaction->location_id = $data->location_id;

    if($transaction->create()){
        echo json_encode(
            array(
                'id' => $transaction->id,
                'date' => $transaction->date,
                'time' => $transaction->time,
                'amount' => $transaction->amount,
                'location_id' =>$transaction->location_id
            )
        );
    } else {
        echo json_encode(
            array('message' => 'Transaction Not Created')
        );
    }