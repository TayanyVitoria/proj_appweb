<?php
session_start();
include "conexao.php";

$nome = $_POST["nome"];
$email = $_POST["email"];
$senha = $_POST["senha"]; // senha normal para validar
$confirmar_senha = $_POST["confirmar_senha"]; // confirmar senha do formulário

// Função para validar a senha
function validarSenha($senha) {
    if (strlen($senha) < 8) return false; // mínimo 8 caracteres
    if (!preg_match("/[A-Z]/", $senha)) return false; // pelo menos 1 maiúscula
    if (!preg_match("/[0-9]/", $senha)) return false; // pelo menos 1 número
    if (!preg_match("/[!@#$%^&*(),.?\":{}|<>]/", $senha)) return false; // caractere especial
    return true;
}

// Verifica se as senhas sao iguais
if ($senha !== $confirmar_senha) {
    die("As senhas não coincidem!");
}

// Verifica força da senha
if (!validarSenha($senha)) {
    die("A senha deve ter no mínimo 8 caracteres, com pelo menos 1 letra maiúscula, 1 número e 1 caractere especial.");
}

// Criptografa a senha antes de salvar
$senhaCriptografada = md5($senha);

// Verifica se o e-mail já está cadastrado
$verifica = "SELECT * FROM usuario WHERE email = '$email'";
$result = $conn->query($verifica);

if ($result->num_rows > 0) {
    die("E-mail já cadastrado! Tente outro.");
}

// Insere o usuário no banco
$sql = "INSERT INTO usuario (usuario, email, senha) VALUES ('$nome', '$email', '$senhaCriptografada')";

if ($conn->query($sql) === TRUE) {
    $_SESSION['usuario'] = $email; // login automático
    header("Location: dashboard.php");
    exit;
} else {
    die("Erro ao cadastrar: " . $conn->error);
}

$conn->close();
?>
