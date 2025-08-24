<?php
session_start();

// Verifica se o usuário está logado
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo "Usuário não logado.";
    exit();
}

// Recebe os dados enviados via fetch
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $registro = [
        "usuario" => $_SESSION['usuario'],
        "tipo" => $data["tipo"],
        "valor" => $data["valor"],
        "tempo" => $data["tempo"],
        "resultado" => $data["resultado"],
        "data" => date("Y-m-d H:i:s")
    ];

    // Caminho para o JSON na pasta /data
    $arquivo = __DIR__ . "/../../data/objetivos.json";

    // Se já existir, carrega, se não, cria novo
    if (file_exists($arquivo)) {
        $conteudo = json_decode(file_get_contents($arquivo), true);
    } else {
        $conteudo = [];
    }

    // Adiciona a nova simulação
    $conteudo[] = $registro;

    // Salva em JSON formatado
    file_put_contents($arquivo, json_encode($conteudo, JSON_PRETTY_PRINT));

    echo "Simulação salva com sucesso!";
} else {
    echo "Dados inválidos.";
}