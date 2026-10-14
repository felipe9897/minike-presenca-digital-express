(() => {
  'use strict';
  const form = document.querySelector('#lead-form');
  const status = document.querySelector('#form-status');
  if (!form || !status) return;

  const clean = value => String(value || '').replace(/[<>]/g, '').trim();
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.className = 'status';
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Revise os campos obrigatorios e o consentimento.';
      status.classList.add('error');
      return;
    }
    const data = new FormData(form);
    const message = [
      'Ola, Minike. Quero informacoes sobre a Presenca Digital Express.',
      `Nome: ${clean(data.get('nome'))}`,
      `Negocio: ${clean(data.get('negocio'))}`,
      `Cidade: ${clean(data.get('cidade'))}`,
      `Contato: ${clean(data.get('contato'))}`,
      `Necessidade: ${clean(data.get('necessidade'))}`
    ].join('\n');

    // O numero oficial ainda nao foi conectado. Nao armazenamos nem enviamos dados.
    navigator.clipboard?.writeText(message).catch(() => {});
    status.textContent = 'Solicitacao preparada e copiada. O envio permanecera desativado ate o canal oficial ser conectado.';
    status.classList.add('ok');
  });
})();

