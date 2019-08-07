<?php
$config = parse_ini_file("../config.ini");
$conn = new mysqli($config['servername'],$config['username'],$config['password'],$config['dbname']);

if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
?>
