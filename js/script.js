let card = document.querySelector('.card');
let loginButton = document.querySelector('.loginButton');
let cadastroButton = document.querySelector('.cadastroButton');

loginButton.onclick = function() {
    card.classList.add('loginActive');
    card.classList.remove('cadastroActive');
}

cadastroButton.onclick = function() {
    card.classList.add('cadastroActive');
    card.classList.remove('loginActive');
}