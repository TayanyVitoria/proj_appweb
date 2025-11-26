// ======================================
// IMPORTS — FIREBASE 11.0.1
// ======================================
import { 
    getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { app, db } from "./firebase-config.js";


// ======================================
// DEBUG
// ======================================
console.log("🔥 APP:", app);
console.log("🔥 DB:", db);


// ======================================
// AUTH
// ======================================
const auth = getAuth(app);


// ======================================
// ELEMENTOS HTML
// ======================================
const btnNovaMeta = document.getElementById("btnNovaMeta");
const modal = document.getElementById("modalMeta");
const btnSalvar = document.getElementById("btnSalvarMeta");
const btnCancelar = document.getElementById("btnCancelar");
const listaMetas = document.getElementById("listaMetas");
const nenhumaMeta = document.getElementById("nenhumaMeta");

// ---- elementos do modal de atualização ----
const modalAtualizar = document.getElementById("modalAtualizar");
const btnCancelarAtualizar = document.getElementById("btnCancelarAtualizar");
const btnConfirmarAtualizar = document.getElementById("btnConfirmarAtualizar");

let metaAtualID = null;
let metaAtualValor = 0;

let userID = null;


// ======================================
// MODAL
// ======================================
btnNovaMeta.addEventListener("click", () => {
    modal.style.display = "flex";
});

btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
});

btnCancelarAtualizar.addEventListener("click", () => {
    modalAtualizar.style.display = "none";
});


// ======================================
// SALVAR META
// ======================================
btnSalvar.addEventListener("click", async () => {

    const titulo = document.getElementById("metaTitulo").value.trim();
    const categoria = document.getElementById("metaCategoria").value;
    const valorMeta = document.getElementById("metaValor").value;
    const valorAtual = document.getElementById("metaAtual").value;
    const prazo = document.getElementById("metaPrazo").value;

    if (!titulo || !valorMeta || !prazo) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    await addDoc(collection(db, "metas"), {
        userID,
        titulo,
        categoria,
        valorMeta: Number(valorMeta),
        valorAtual: Number(valorAtual),
        prazo
    });

    modal.style.display = "none";
    carregarMetas();
});


// ======================================
// FUNÇÃO PARA ABRIR MODAL DE ATUALIZAÇÃO
// ======================================
function abrirAtualizacao(id, valorAtual) {
    metaAtualID = id;
    metaAtualValor = valorAtual;
    modalAtualizar.style.display = "flex";
}


// ======================================
// CONFIRMAR ATUALIZAÇÃO
// ======================================
btnConfirmarAtualizar.addEventListener("click", async () => {
    const valorAdicionar = Number(document.getElementById("valorAdicionar").value);

    if (!valorAdicionar || valorAdicionar <= 0) {
        alert("Digite um valor válido!");
        return;
    }

    const novoValor = metaAtualValor + valorAdicionar;

    await updateDoc(doc(db, "metas", metaAtualID), {
        valorAtual: novoValor
    });

    modalAtualizar.style.display = "none";
    carregarMetas();
});


// ======================================
// CARREGAR METAS
// ======================================
async function carregarMetas() {
    listaMetas.innerHTML = "";

    const q = query(
        collection(db, "metas"),
        where("userID", "==", userID)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        nenhumaMeta.style.display = "flex";
        return;
    }

    nenhumaMeta.style.display = "none";

    snap.forEach(docItem => {
        const meta = docItem.data();
        const metaID = docItem.id;

        const porcentagem = Math.min(
            Math.round((meta.valorAtual / meta.valorMeta) * 100),
            100
        );

        const diasRestantes = Math.ceil(
            (new Date(meta.prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        // =============================
        // ALERTA DE PRAZO PRÓXIMO
        // =============================
        if (diasRestantes <= 7) {
            if (meta.valorAtual >= meta.valorMeta) {
                alert(`🎉 A meta "${meta.titulo}" está quase no prazo e você JÁ atingiu o objetivo!`);
            } else {
                alert(`⚠️ A meta "${meta.titulo}" está perto de vencer!\nFaltam ${diasRestantes} dias.`);
            }
        }

        const div = document.createElement("div");
        div.classList.add("meta-card");

        div.innerHTML = `
            <div class="meta-top">
                <h3>${meta.titulo}</h3>
                <button class="btn-delete" data-id="${metaID}">🗑️</button>
            </div>

            <p><strong>Categoria:</strong> ${meta.categoria}</p>
            <p><strong>Prazo:</strong> ${meta.prazo.split("-").reverse().join("/")}</p>

            <div class="progress-box">
                <div class="progress-bar" style="width: ${porcentagem}%"></div>
            </div>

            <p><strong>${porcentagem}% concluído</strong></p>
            <p>R$ ${meta.valorAtual.toLocaleString("pt-BR")} de R$ ${meta.valorMeta.toLocaleString("pt-BR")}</p>

            <button class="btn-update" data-id="${metaID}" data-atual="${meta.valorAtual}">
                ➕ Atualizar Meta
            </button>
        `;

        listaMetas.appendChild(div);
    });

    // Excluir meta
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            await deleteDoc(doc(db, "metas", id));
            carregarMetas();
        });
    });

    // Atualizar meta
    document.querySelectorAll(".btn-update").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            const atual = Number(e.target.getAttribute("data-atual"));
            abrirAtualizacao(id, atual);
        });
    });
}


// ======================================
// VERIFICAR LOGIN
// ======================================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    userID = user.uid;
    console.log("Usuário logado:", userID);
    carregarMetas();
});

console.log("Script metas.js carregado com sucesso!");
