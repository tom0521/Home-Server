<?php

include 'connect.php';

$sql = "SELECT category, SUM(price) as total FROM spending GROUP BY category";

$result = $conn->query($sql);

$jsonObj = array(
	'labels'=>array(),
	'datasets'=>array(
		array(
			'name'=>'Expenses',
			'values'=>array(),
		)
	)	
);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$jsonObj['labels'][] = $row['category'];
		$jsonObj['datasets'][0]['values'][] = floatval($row['total']);
	}
}

echo json_encode($jsonObj);

$conn->close();
?>
