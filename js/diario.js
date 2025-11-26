import { auth, db } from "./firebase-config.js";

import {
    addDoc,
    collection
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

let userID = null;

onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    userID = user.uid;
});

const form = document.getElementById("formTransacao");
const msg = document.getElementById("mensagem");

form.addEventListener("submit", async e => {
    e.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const valor = Number(document.getElementById("valor").value);
    const data = document.getElementById("data").value;
    const descricao = document.getElementById("descricao").value;

    if (!data || !descricao || !valor) {
        msg.textContent = "Preencha todos os campos!";
        msg.style.color = "red";
        return;
    }

    try {
        await addDoc(collection(db, "transacoes"), {
            uid: userID,
            tipo,
            valor,
            data,
            descricao,
            criadoEm: new Date()
        });

        msg.textContent = "Transação salva com sucesso!";
        msg.style.color = "green";
        form.reset();

    } catch (error) {
        msg.textContent = "Erro ao salvar: " + error.message;
        msg.style.color = "red";
    }
});
