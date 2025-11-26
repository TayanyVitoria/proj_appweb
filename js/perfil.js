// /js/perfil.js
console.log("📌 perfil.js carregado (compatível com seu login).");

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// importa seu app (mesmo arquivo que você já usa no projeto)
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

// elementos (ids iguais aos que eu coloquei no HTML acima)
const nomeEl = document.getElementById("perfilNome");
const emailEl = document.getElementById("perfilEmail");
const idEl = document.getElementById("perfilID");
const logoutBtn = document.getElementById("logout");

// proteção de rota e preenchimento dos dados
onAuthStateChanged(auth, async (user) => {
  // se não estiver logado, volta pra login (mesmo comportamento do seu script)
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // preenche o UID (sempre disponível)
  idEl.textContent = user.uid;

  try {
    // tenta buscar documento do usuário na collection "usuarios"
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      nomeEl.textContent = data.nome ?? (user.displayName || "Usuário");
      emailEl.textContent = data.email ?? user.email;
    } else {
      // se não existir documento, usa dados do Auth e cria o documento automaticamente
      const fallbackName = user.displayName || "Usuário";
      nomeEl.textContent = fallbackName;
      emailEl.textContent = user.email;

      // cria documento com os dados mínimos (isso evita inconsistência)
      await setDoc(ref, {
        nome: fallbackName,
        email: user.email,
        criadoEm: new Date()
      });
    }

  } catch (err) {
    console.error("Erro ao carregar dados do perfil:", err);
    // preenche com fallback mínimo
    nomeEl.textContent = user.displayName || "Usuário";
    emailEl.textContent = user.email || "—";
  }
});

// logout (id = "logout", igual ao seu script de login original)
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (err) {
      console.error("Erro no logout:", err);
      alert("Erro ao sair. Tente novamente.");
    }
  });
}
