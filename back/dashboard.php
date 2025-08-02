<<?php
session_start();
if(!isset($_SESSION['usuario'])) {
    header("Location: /proj_appweb/front/login.html");
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Projeto Estoque</title>
    <link rel="stylesheet" href="/proj_appweb/front/css/style.css">
</head>   
<h2>Bem-vindo, <?php echo $_SESSION['usuario']; ?>!</h2>
<a href="/proj_appweb/front/inserir.html">Inserir Produto</a> 
<a href="/proj_appweb/back/consulta.php">Consultar Produtos</a> 
<a href="/proj_appweb/back/logout.php">Sair</a>