# Presenca Digital Express MINIKE

Template open source de uma pagina comercial responsiva para pequenos negocios.
Nao possui dependencia externa, rastreador, credencial ou envio real de formulario.

## Recursos

- pagina estatica responsiva;
- secoes de oferta, planos, processo e contato;
- formulario local com validacao e consentimento;
- politica de privacidade demonstrativa;
- teste automatico de referencias, HTTP, JavaScript e segredos comuns.

## Executar

```bash
cd /srv/felipe-workspace/RENDA_MINIKE/produto
python3 -m http.server 8787 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8787/` no proprio servidor ou encaminhe a porta por SSH.

## Publicar na Hostinger

Este projeto pode ser publicado como site HTML estatico pelo fluxo de Git da
Hostinger. Conecte este repositorio, use a branch `main` e aponte o diretorio de
instalacao para uma pasta vazia. Antes de usar comercialmente, personalize os
dados, a politica e o canal de contato.

## Testar

```bash
python3 smoke_test.py
```

O teste sobe um servidor efemero, valida as rotas, referencias locais, elementos
essenciais, ausencia de segredos comuns e comportamento sintatico do JavaScript.

## Antes de publicar

1. substituir demonstracao pelo nome/numero oficial do canal;
2. revisar a politica com os dados reais do controlador e canal de privacidade;
3. conectar backend/WhatsApp oficial sem expor token no frontend;
4. configurar checkout em conta oficial e confirmar por webhook/API;
5. aprovar primeiro deploy, fazer backup e testar rollback, HTTPS e formulario;
6. remover o aviso de demonstracao somente depois de todos os gates passarem.

## Licenca

MIT. Consulte `LICENSE`.

