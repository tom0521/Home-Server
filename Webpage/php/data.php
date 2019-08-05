<?php
include 'connect.php';

$sql = "SELECT MONTHNAME(date) AS month, MONTH(date), SUM(amount) AS amount FROM income GROUP BY MONTHNAME(date), MONTH(date) ORDER BY MONTH(date)";

include 'json-query.php';

$conn->close();
?>
