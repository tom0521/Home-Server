<?php
include 'connect.php';

$sql = "SELECT MONTHNAME(timestamp) as month, MONTH(timestamp), SUM(price) as amount FROM spending GROUP BY MONTHNAME(timestamp), MONTH(timestamp) ORDER BY MONTH(timestamp)";

include 'json-query.php';

$conn->close();
?>
