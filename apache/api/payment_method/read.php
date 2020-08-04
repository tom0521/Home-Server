<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    include_once '../../config/Database.php';
    include_once '../../models/Payment_Method.php';

    $database = new Database();
    $db = $database->connect();

    $payment_method = new Payment_Method($db);
    $result = $payment_method->read();
    $num = $result->rowCount();

    if($num > 0){
        $payment_method_arr = array();
        $payment_method_arr['data_length'] = $num;
        $payment_method_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $payment_method_item = array(
                'payment_method_id' => $payment_method_id,
                'payment_method' => $payment_method
            );

            array_push($payment_method_arr['data'], $payment_method_item);
        }

        echo json_encode($payment_method_arr);
    } else {
        echo json_encode(
            array('message' => 'No Payment Methods Found')
        );
    }