<?php
include 'conexao.php';
 
$sql = "SELECT * FROM produto";
$result = $conn->query($sql);
 
echo "<h2>Lista de Produtos</h2>";
echo "<table border='1'>
<tr><th>ID</th><th>Nome</th><th>Quantidade</th><th>Preço</th><th>Ações</th></tr>";
 
while($row = $result->fetch_assoc()) {
    echo "<tr>
    <td>".$row['id']."</td>
    <td>".$row['nome']."</td>
    <td>".$row['quantidade']."</td>
    <td>".$row['preco']."</td>
    <td><a href='/proj_appweb/back/editar.php?id=".$row['id']."'>Editar</a></td>
    </tr>";
}
echo "</table>";
 
echo "<br><a href='/proj_appweb/back/dashboard.php'>Voltar</a>";
?>
