<?php

include 'connect.php';

$sql = "SELECT income.gross_income, expenses.expenses, income.gross_income - expenses.expenses AS net_income
	FROM (
		SELECT SUM(amount) as gross_income FROM finances.income
	) AS income,
	(
		SELECT SUM(price) as expenses FROM finances.spending
	) AS expenses";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
	$row = $result->fetch_assoc();
	echo json_encode(array(
		"gross_income"=>floatval($row['gross_income']),
		"expenses"=>floatval($row['expenses']),
		"net_income"=>floatval($row['net_income'])));
}

$conn->close();

?>
