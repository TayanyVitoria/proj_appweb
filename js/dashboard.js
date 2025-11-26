// js/dashboard.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      document.getElementById("welcomeMessage").innerText = `Bem-vindo(a), ${user.displayName || "Usuário"}!`;
      carregarFluxoDeCaixa(user.uid);
    } else {
      // se não estiver logado (auth-guard pode já redirecionar)
      // window.location.href = "login.html";
    }
  });
});

async function carregarFluxoDeCaixa(uid) {
  const ref = collection(db, "transacoes");
  const q = query(ref, where("uid", "==", uid));

  const snap = await getDocs(q);

  // prepara meses
  const meses = {
    "01": { entrada: 0, saida: 0 },
    "02": { entrada: 0, saida: 0 },
    "03": { entrada: 0, saida: 0 },
    "04": { entrada: 0, saida: 0 },
    "05": { entrada: 0, saida: 0 },
    "06": { entrada: 0, saida: 0 },
    "07": { entrada: 0, saida: 0 },
    "08": { entrada: 0, saida: 0 },
    "09": { entrada: 0, saida: 0 },
    "10": { entrada: 0, saida: 0 },
    "11": { entrada: 0, saida: 0 },
    "12": { entrada: 0, saida: 0 }
  };

  if (!snap || snap.size === 0) {
    document.getElementById("noDataAlert").style.display = "block";
    atualizarCards(0, 0);
    gerarGraficoFluxoCaixa([], [], []);
    return;
  }

  // soma total do mês atual (exemplo mostrar em cards)
  let totalEntradasMesAtual = 0;
  let totalSaidasMesAtual = 0;

  snap.forEach(docSnap => {
    const t = docSnap.data();

    // validações básicas
    if (!t) return;
    const tipo = (t.tipo || "").toString().toLowerCase();
    const valor = Number(t.valor) || 0;

    // tenta extrair mês a partir de campo de data
    let mes = null;
    if (typeof t.data === "string" && t.data.length >= 7) {
      // aceita formatos YYYY-MM-DD ou YYYY/MM/DD
      const normalized = t.data.replace(/\//g, "-");
      if (normalized.length >= 7) mes = normalized.substring(5, 7);
    } else if (t.data instanceof Date) {
      const mm = (t.data.getMonth() + 1).toString().padStart(2, "0");
      mes = mm;
    } else if (t.createdAt && t.createdAt.toDate) {
      // Timestamp do Firestore
      const dateObj = t.createdAt.toDate();
      mes = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    }

    // se não conseguiu mes, ignore (ou trate como atual)
    if (!mes || !meses[mes]) {
      // opcional: calcular mês atual e somar nele
      const now = new Date();
      mes = (now.getMonth() + 1).toString().padStart(2, "0");
    }

    if (tipo === "entrada") {
      meses[mes].entrada += valor;
    } else {
      // aceita 'saida' ou 'saída'
      meses[mes].saida += valor;
    }

    // para cards: se for do mês atual, some
    const nowMes = (new Date().getMonth() + 1).toString().padStart(2, "0");
    if (mes === nowMes) {
      if (tipo === "entrada") totalEntradasMesAtual += valor;
      else totalSaidasMesAtual += valor;
    }
  });

  // se todas entradas e saídas são zero -> sem dados relevantes
  const somaTotal = Object.values(meses).reduce((acc, m) => acc + m.entrada + m.saida, 0);
  if (somaTotal === 0) {
    document.getElementById("noDataAlert").style.display = "block";
  } else {
    document.getElementById("noDataAlert").style.display = "none";
  }

  // atualiza cards
  atualizarCards(totalEntradasMesAtual, totalSaidasMesAtual);

  const labels = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const entradas = Object.values(meses).map(m => Number(m.entrada.toFixed(2)));
  const saidas = Object.values(meses).map(m => Number(m.saida.toFixed(2)));

  gerarGraficoFluxoCaixa(labels, entradas, saidas);
}

function atualizarCards(entradas, saidas) {
  const elIncome = document.getElementById("cardIncome");
  const elExpense = document.getElementById("cardExpense");
  if (elIncome) elIncome.innerText = `R$ ${entradas.toLocaleString('pt-BR', {minimumFractionDigits:2})}`;
  if (elExpense) elExpense.innerText = `R$ ${saidas.toLocaleString('pt-BR', {minimumFractionDigits:2})}`;
}

function gerarGraficoFluxoCaixa(labels, entradas, saidas) {
  const canvas = document.getElementById("cashFlowChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // destrói gráfico anterior, se existir
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Entradas",
          data: entradas,
          borderColor: "#FF8A00",
          backgroundColor: "rgba(255,138,0,0.06)",
          borderWidth: 3,
          tension: 0.35,
          fill: true,
          pointRadius: 3
        },
        {
          label: "Saídas",
          data: saidas,
          borderColor: "#D93636",
          backgroundColor: "rgba(217,54,54,0.04)",
          borderDash: [6,4],
          borderWidth: 3,
          tension: 0.35,
          fill: true,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => 'R$ ' + Number(v).toLocaleString('pt-BR')
          }
        }
      }
    }
  });
}




