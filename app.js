(() => {
  'use strict';
  const form = document.querySelector('#lead-form');
  const status = document.querySelector('#form-status');
  const copyFallback = document.querySelector('#copy-fallback');
  const preparedMessage = document.querySelector('#prepared-message');
  if (!form || !status || !copyFallback || !preparedMessage) return;

  const clean = value => String(value || '').replace(/[<>]/g, '').trim();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.className = 'status';
    copyFallback.hidden = true;
    preparedMessage.value = '';
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
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        throw new Error('Clipboard API indisponivel');
      }
      await navigator.clipboard.writeText(message);
      status.textContent = 'Solicitacao preparada e copiada. Nada foi enviado por este site.';
      status.classList.add('ok');
    } catch {
      preparedMessage.value = message;
      copyFallback.hidden = false;
      preparedMessage.focus();
      preparedMessage.select();
      status.textContent = 'Nao foi possivel copiar automaticamente. Copie manualmente a mensagem exibida abaixo; nada foi enviado.';
      status.classList.add('warning');
    }
  });
})();

