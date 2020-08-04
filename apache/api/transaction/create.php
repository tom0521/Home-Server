<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,
    Access-Control-Allow-Methods,Content-Type,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Transaction.php';

    $database = new Database();
    $db = $database->connect();

    $transaction = new Transaction($db);

    $data = json_decode(file_get_contents("php://input"));

    $transaction->timestamp = $data->timestamp;
    $transaction->amount = $data->amount;
    $transaction->address_id = $data->address_id;
    $transaction->receipt = $data->receipt;
    $transaction->payment_method_id = $data->payment_method_id;
    $transaction->note = $data->note;

    if($transaction->create()){
        echo json_encode(
            array(
                'transaction_id' => $transaction->transaction_id,
                'timestamp' => $transaction->timestamp,
                'amount' => $transaction->amount,
                'address_id' => $transaction->address_id,
                'receipt' => $transaction->receipt,
                'payment_method' => $transaction->payment_method_id,
                'note' => $transaction->note
            )
        );
    } else {
        echo json_encode(
            array('message' => 'Transaction Not Created')
        );
    }