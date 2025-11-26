console.log('✅ Script carregado com sucesso!');

/* ================================
   🔄 Transição entre login/cadastro
================================== */
let card = document.querySelector('.card');
let loginButton = document.querySelector('.loginButton');
let cadastroButton = document.querySelector('.cadastroButton');

loginButton.onclick = function() {
  card.classList.add('loginActive');
  card.classList.remove('cadastroActive');
};

cadastroButton.onclick = function() {
  card.classList.add('cadastroActive');
  card.classList.remove('loginActive');
};

/* ================================
   🔐 Validação de senha no cadastro
================================== */
document.addEventListener('DOMContentLoaded', function () {
  const senha = document.getElementById('senha');
  const confirmar = document.getElementById('confirmar_senha');
  const box = document.getElementById('password-requirements');

  if (!senha || !confirmar || !box) {
    console.warn('Validação de senha: campos não encontrados (verifique ids).');
    return;
  }

  const reqLength = document.getElementById('req-length');
  const reqUpper = document.getElementById('req-upper');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');
  const reqMatch = document.getElementById('req-match');

  function setOk(el, ok) {
    const icon = el.querySelector('.req-icon');
    if (ok) {
      el.classList.add('ok');
      if (icon) { icon.classList.remove('fa-xmark'); icon.classList.add('fa-check'); }
    } else {
      el.classList.remove('ok');
      if (icon) { icon.classList.remove('fa-check'); icon.classList.add('fa-xmark'); }
    }
  }

  function validate() {
    const v = senha.value;
    const c = confirmar.value;

    const checks = [
      { el: reqLength, ok: v.length >= 8 },
      { el: reqUpper, ok: /[A-Z]/.test(v) },
      { el: reqNumber, ok: /[0-9]/.test(v) },
      { el: reqSpecial, ok: /[!@#$%^&*(),.?":{}|<>]/.test(v) },
      { el: reqMatch, ok: v !== '' && v === c }
    ];

    let anyMissing = false;
    for (const ch of checks) {
      setOk(ch.el, ch.ok);
      if (!ch.ok) anyMissing = true;
    }

    if ((v.length > 0 || c.length > 0) && anyMissing) box.style.display = 'block';
    else box.style.display = 'none';
  }

  senha.addEventListener('input', validate);
  confirmar.addEventListener('input', validate);
});

/* ===============================
   🔥 Firebase Authentication + Firestore
================================= */
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

/* ==============
   📝 CADASTRO
================= */
const formCadastro = document.querySelector('.formCadastro form');
if (formCadastro) {
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = formCadastro.querySelector('input[name="nome"]').value.trim();
    const email = formCadastro.querySelector('input[name="email"]').value.trim();
    const senha = formCadastro.querySelector('input[name="senha"]').value.trim();
    const confirmar = formCadastro.querySelector('input[name="confirmar_senha"]').value.trim();

    if (senha !== confirmar) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await updateProfile(user, { displayName: nome });

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        criadoEm: new Date()
      });

      await setDoc(doc(db, "users", user.uid), {
        nome: nome,
        email: email,
        criadoEm: new Date()
      });

      alert('✅ Conta criada com sucesso!');
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert('Erro ao cadastrar: ' + error.message);
    }
  });
}

/* ==============
   🔑 LOGIN
================= */
const formLogin = document.querySelector('.formLogin form');
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = formLogin.querySelector('input[name="email"]').value.trim();
    const senha = formLogin.querySelector('input[name="senha"]').value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert('✅ Login realizado com sucesso!');
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Erro no login:", error);
      alert('Erro ao fazer login: ' + error.message);
    }
  });
}

/* ==========================
   🚪 LOGOUT
========================== */
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    alert('Você saiu da conta.');
    window.location.href = "login.html";
  });
}

/* ================================
   👤 Proteção e nome do usuário
================================ */
onAuthStateChanged(auth, async (user) => {
  const isLoginPage = window.location.pathname.includes('login.html');

  if (!user && !isLoginPage) {
    window.location.href = "login.html";
    return;
  }

  if (user && isLoginPage) {
    window.location.href = "dashboard.html";
    return;
  }

  const userNameEl = document.getElementById('userName');
  if (userNameEl && user) {
    try {
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        userNameEl.textContent = data.nome || user.displayName || 'Usuário';
      } else {
        userNameEl.textContent = user.displayName || 'Usuário';
      }
    } catch (err) {
      console.error("Erro ao buscar nome:", err);
      userNameEl.textContent = user.displayName || 'Usuário';
    }
  }

  /*  🔥 CORREÇÃO AQUI 🔥 */
  if (user) {
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(
        docRef,
        {
          nome: user.displayName ?? "Sem nome",
          email: user.email,
          criadoEm: new Date(),
        },
        { merge: true }
      );
    }
  }
});