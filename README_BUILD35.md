# Build 35 — Drag-and-drop e legibilidade

## Mudanças
- Arraste cartas do deck para uma das cinco zonas.
- Arraste uma carta ocupada para outra zona para mover ou trocar as cartas. A cena Three.js recebe o novo array de zonas e atualiza monstros e ilustrações nas posições correspondentes.
- Ao arrastar uma carta para outra que forma uma das quatro combinações, a fusão é anunciada e a zona-alvo ganha destaque; ambos os guardiões permanecem no campo, e a combinação concede bônus no ataque.
- Guia visual de fusões com nomes e bônus; pares disponíveis ficam destacados.
- Nomes e miniaturas maiores nos controles do duelo.

## Testes
A sintaxe TSX passou na transpilação TypeScript local (sem diagnósticos). O ZIP foi testado. A compilação Vite e o teste visual não foram executados: npm install falhou por indisponibilidade de rede (EAI_AGAIN).

## Execução
npm install
npm run build
npm run dev
