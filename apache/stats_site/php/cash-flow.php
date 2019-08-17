<?php
include 'connect.php';

$sql = "SELECT income.month AS month,
         income.income AS income, expenses.expenses AS expenses
         FROM (
         	SELECT MONTH(date) AS month, SUM(amount) as income
         	FROM finances.income GROUP BY MONTH(date) ORDER BY MONTH(date)
         ) AS income,
         (
         	SELECT MONTH(timestamp) AS month, SUM(price) as expenses
         	FROM finances.spending GROUP BY MONTH(timestamp) ORDER BY MONTH(timestamp)
         ) AS expenses
         WHERE income.month=expenses.month";

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
	$prev = 0; 
	while($row = $result->fetch_assoc()) {
		$jsonObj['labels'][] = $row['month'];
		$jsonObj['datasets'][0]['values'][] = floatval($row['income']);
		$jsonObj['datasets'][1]['values'][] = floatval($row['expenses']);
		$prev += floatval($row['income']) - floatval($row['expenses']);
		$jsonObj['datasets'][2]['values'][] = $prev;
	}
}


echo json_encode($jsonObj);

$conn->close();
?>
