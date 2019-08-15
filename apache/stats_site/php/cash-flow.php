<?php
include 'connect.php';

$sql = "SELECT MONTHNAME(date) AS month, MONTH(date), SUM(amount) AS amount FROM income GROUP BY MONTHNAME(date), MONTH(date) ORDER BY MONTH(date)";

$result = $conn->query($sql);

$jsonObj = array(
	'labels'=>array(),
	'datasets'=>array(
		array(
			'name'=>'Income',
			'values'=>array(),
			'chartType'=>'bar'
		),
		array(
			'name'=>'Spending',
			'values'=>array(),
			'chartType'=>'bar'
		),
		array(
			'name'=>'Cumulative Cash Flow',
			'values'=>array(),
			'chartType'=>'line'
		)
	)
);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$jsonObj['labels'][] = $row['month'];
		$jsonObj['datasets'][0]['values'][] = $row['amount'];
	}
}

$sql = "SELECT MONTHNAME(timestamp) AS month, MONTH(timestamp), SUM(price) AS amount FROM spending GROUP BY MONTHNAME(timestamp), MONTH(timestamp) ORDER BY MONTH(timestamp)";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$jsonObj['datasets'][1]['values'][] = $row['amount'];
	}
}

for($i=0; $i<$result->num_rows; $i++){
	if($i!=0){
		$prev = $jsonObj['datasets'][2]['values'][$i-1];
	} else {
		$prev = 0;
	}
	$jsonObj['datasets'][2]['values'][] = $prev + ($jsonObj['datasets'][0]['values'][$i] - $jsonObj['datasets'][1]['values'][$i]);
}

echo json_encode($jsonObj);

$conn->close();
?>
