<?php
include 'connect.php';

$conn->query("SET @runtot:=0");

$sql = "SELECT income.month AS month,
	 income.income AS income, expenses.expenses AS expenses,
	 (@runtot:=@runtot + income.income - expenses.expenses) as cumulative
         FROM (
         	SELECT MONTHNAME(date) AS month, MONTH(date), SUM(amount) as income
         	FROM finances.income GROUP BY MONTHNAME(date), MONTH(date) ORDER BY MONTH(date)
         ) AS income,
         (
         	SELECT MONTHNAME(timestamp) AS month, MONTH(timestamp), SUM(price) as expenses
         	FROM finances.spending GROUP BY MONTHNAME(timestamp), MONTH(timestamp) ORDER BY MONTH(timestamp)
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
	while($row = $result->fetch_assoc()) {
		$jsonObj['labels'][] = $row['month'];
		$jsonObj['datasets'][0]['values'][] = floatval($row['income']);
		$jsonObj['datasets'][1]['values'][] = floatval($row['expenses']);
		$jsonObj['datasets'][2]['values'][] = floatval($row['cumulative']);
	}
}


echo json_encode($jsonObj);

$conn->close();
?>
