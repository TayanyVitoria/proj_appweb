<?php
include 'conexao.php';
 
$nome = $_POST['nome'];
$quantidade = $_POST['quantidade'];
$preco = $_POST['preco'];
 
$sql = "INSERT INTO produto (nome, quantidade, preco) VALUES ('$nome', $quantidade, $preco)";
 
if ($conn->query($sql) === TRUE) {
    echo "Produto inserido com sucesso! <a href='/proj_appweb/back/dashboard.php'>Voltar</a>";
} else {
    echo "Erro: " . $conn->error;
}
?>00