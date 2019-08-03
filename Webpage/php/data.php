<?php
include 'connect.php';

$sql = "SELECT MONTHNAME(date) AS month, MONTH(date), SUM(amount) AS amount FROM income GROUP BY MONTHNAME(date), MONTH(date) ORDER BY MONTH(date)";
$result = $conn->query($sql);

$rows = array();
if ($result->num_rows > 0) {
	while ($row = $result->fetch_assoc()) {
		$rows[] = $row;
	}
}
echo json_encode($rows);
$conn->close();
?>
