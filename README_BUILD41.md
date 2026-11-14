# Build 41 — PT/EN, currículo atualizado e responsividade

## Alterações
- Contato: removida a linha redundante com WhatsApp e LinkedIn, mantendo botões de acesso.
- Currículo: o PDF enviado pelo usuário foi copiado integralmente para `public/curriculo-premio.pdf` (recompensa do BUG) e `public/Curriculo_Jonas_Dzelme_Atualizado.pdf` (botão de contato).
- Idioma: seletor PT / EN no cabeçalho, com preferência salva no navegador e `lang` do documento atualizado. A interface principal, projetos, instruções e navegação têm traduções; nomes próprios, siglas e marcas permanecem iguais. O PDF original está em português, inclusive na versão EN.
- CSS responsivo: refinamentos para desktops, tablets (até 900px) e celulares (até 600px e 380px), inclusive campos do duelo, deck e botões de contato.

## Validação
- Transpilação de sintaxe TSX com TypeScript: sem diagnósticos.
- ZIP: integridade verificada.
- `npm install` não foi concluído dentro do tempo disponível; portanto, `vite build` e testes reais em Chromium não foram executados.
- É necessário conferir manualmente no navegador, especialmente drag-and-drop em dispositivos touch (arrastar HTML5 pode variar entre navegadores móveis).
