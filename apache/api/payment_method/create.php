<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Content-Type,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Payment_Method.php';

    $database = new Database('finances');
    $db = $database->connect();

    $payment_method = new Payment_Method($db);

    $data = json_decode(file_get_contents("php://input"));

    $payment_method->payment_method = $data->payment_method;

    if($payment_method->create()){
        echo json_encode(
            array(
                'payment_method_id' => $payment_method->payment_method_id,
                'payment_method' => $payment_method->payment_method
            )
        );
    } else {
        echo json_encode(
            array('message' => 'Payment Method Not Created')
        );
    }