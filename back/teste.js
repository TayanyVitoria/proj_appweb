
//PASSAR IMAGENS DO CARROSSEL
// Seleciona os elementos do carrossel

var radio = document.querySelector('.manual-btn')
var cont =1


// Função para avançar as imagens do carrossel
document.getElementById('radio1').checked = true
setInterval(() => {
  proximaImg()
}, 10000)

function proximaImg(){
  cont++;
  if(cont > 3){
    cont = 1;
  }
  
  document.getElementById('radio'+cont).checked = true;
}


//SEÇÃO NOSSOS-PLANOS
// Destaque ao clicar nos planos
function selecionarPlano(card) {
  const todosOsCards = document.querySelectorAll('.preco-card');
  todosOsCards.forEach(c => c.classList.remove('selecionado'));
  card.classList.add('selecionado');
}

// Clique no botão "Começar"
function iniciarPlano(event, nomePlano) {
  event.stopPropagation(); // Impede o clique de acionar o card
  alert(`Você escolheu o plano: ${nomePlano}`);
}

//BOTÃÓ PISCANDO NOSSOS PLANOS
function piscarBotoesComecar() {
  const botoes = document.querySelectorAll('.btn-comecar');

  setInterval(() => {
    botoes.forEach(botao => {
      botao.style.opacity = botao.style.opacity === '0.3' ? '1' : '0.3';
    });
  }, 500);
}

window.addEventListener('DOMContentLoaded', piscarBotoesComecar);

//PASSAR IMAGENS DO CARROSSEL
// Seleciona os elementos do carrossel

var radio = document.querySelector('.manual-btn')
var cont =1


// Função para avançar as imagens do carrossel
document.getElementById('radio1').checked = true
setInterval(() => {
  proximaImg()
}, 10000)

function proximaImg(){
  cont++;
  if(cont > 3){
    cont = 1;
  }
  
  document.getElementById('radio'+cont).checked = true;
}


//SEÇÃO NOSSOS-PLANOS
// Destaque ao clicar nos planos
function selecionarPlano(card) {
  const todosOsCards = document.querySelectorAll('.preco-card');
  todosOsCards.forEach(c => c.classList.remove('selecionado'));
  card.classList.add('selecionado');
}

// Clique no botão "Começar"
function iniciarPlano(event, nomePlano) {
  event.stopPropagation(); // Impede o clique de acionar o card
  alert(`Você escolheu o plano: ${nomePlano}`);
}

//BOTÃÓ PISCANDO NOSSOS PLANOS
function piscarBotoesComecar() {
  const botoes = document.querySelectorAll('.btn-comecar');

  setInterval(() => {
    botoes.forEach(botao => {
      botao.style.opacity = botao.style.opacity === '0.3' ? '1' : '0.3';
    });
  }, 500);
}

window.addEventListener('DOMContentLoaded', piscarBotoesComecar);

console.log("teste.js carregado com sucesso!");