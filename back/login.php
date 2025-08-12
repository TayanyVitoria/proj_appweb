
<?php

session_start();
include "conexao.php";

$usuario = $_POST["email"];
$senha =md5($_POST["senha"]);

$sql = "SELECT * FROM usuario WHERE email = '$usuario' AND senha = '$senha'";

$result = $conn->query($sql);
if($result->num_rows > 0){
    $_SESSION['usuario'] = $usuario;
    header('Location: dashboard.php');
}else{
    echo'Usuario invalido';
}