
<link rel="stylesheet" href="/proj_appweb/css/style.css">
<?php
include 'conexao.php';
 
$id = $_GET['id'];
$sql = "SELECT * FROM produto WHERE id=$id";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
?>
 
<form action="/proj_appweb/back/atualizar.php" method="POST">
    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
    <input type="text" name="nome" value="<?php echo $row['nome']; ?>" required><br>
    <input type="number" name="quantidade" value="<?php echo $row['quantidade']; ?>" required><br>
    <input type="number" step="0.01" name="preco" value="<?php echo $row['preco']; ?>" required><br>
    <button type="submit">Atualizar</button>
</form>