<?php
$conn = mysqli_connect('localhost', 'root', '', 'aiflowassignment');
if (mysqli_connect_errno()) {
	die("Connection failed: " . mysqli_connect_error());
}

function db_connect()
{
    $conn = new mysqli('localhost', 'root', '', 'aiflowassignment');

    if(!$conn) {
        throw new Exception('Could not connect to database server');
    }

    return $conn;
}
?>