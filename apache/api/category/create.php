<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,
        Access-Control-Allow-Methods,Authorization,X-Requested-With');

    include_once '../../config/Database.php';
    include_once '../../models/Category.php';

    $database = new Database();
    $db = $database->connect();

    $category = new Category($db);

    $data = json_decode(file_get_contents("php://input"));

    $category->category = $data->category;
    $result = $category->read_single();
    if ($result->rowCount() == 0) {
        $category->create();
        $result = $category->read_single();
    }

    $num = $result->rowCount();
    if($num > 0){
        $category_arr = array();
        $category_arr['data_length'] = $num;
        $category_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $category_item = array(
                'category_id' => $category_id,
                'category' => $category
            );

            array_push($category_arr['data'], $category_item);
        }

        echo json_encode($category_arr);
    } else {
        echo json_encode(
            array('message' => 'Category Not Created')
        );
    }