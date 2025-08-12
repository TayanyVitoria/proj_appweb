/*Transição tela de login cadastro */
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


/*Validação de senha */ 
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
  