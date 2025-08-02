<?php

$host = "localhost";
$user = "root";
$pass = "Welcome@ads";
$db = "loja";
 
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Falha de conexão" . $conn->connect_error);
}