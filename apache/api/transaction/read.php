<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Transaction.php';

    $database = new Database();
    $db = $database->connect();

    $transaction = new Transaction($db);
    $result = $transaction->read();
    $num = $result->rowCount();

    if($num > 0){
        $transactions_arr = array();
        $transactions_arr['income'] = 0;
        $transactions_arr['spending'] = 0;
        $transactions_arr['data_length'] = $num;
        $transactions_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            if($amount > 0){
                $transactions_arr['income'] += $amount;
            } else {
                $transactions_arr['spending'] += $amount;
            }
            $transaction_item = array(
                'transaction_id' => $transaction_id,
                'timestamp' => $timestamp,
                'amount' => $amount,
                'address_id' => $address_id,
                'receipt' => $receipt,
                'payment_method' => $payment_method,
                'category_id' => $category_id,
                'note' => $note
            );

            array_push($transactions_arr['data'], $transaction_item);
        }

        echo json_encode($transactions_arr);
    } else {
        echo json_encode(
            array('message' => 'No Transactions Found')
        );
    }