# Transição em Foco — hub do colaborador

Página estática (HTML + CSS + JS puro) no mesmo sistema visual do Organograma zhouse. Pronta para GitHub Pages e iframe na intranet Conexão.

```
transicao/
  index.html           página
  css/styles.css       estilos (escopados em .tf-app)
  js/data.js           CONTEÚDO — edite aqui
  js/transicao.js      renderização e interação
  images/zhouse.png    logo (capa padrão do vídeo)
  fonts/               Rubik + Material Icons
```
Versão anterior (baseada nos slides): `transicao-v1/`.

## Arquitetura
1. **Início:** título, busca geral (pontos focais, centros de custo, políticas e FAQ; atalho `/`), vídeo do Fabrino e 4 acessos rápidos.
2. **Quem procurar?** Pontos Focais CSC, com busca por assunto e filtro por área.
3. **Quem aprova?** Alçadas FlyTour. "Consultar alçadas" abre a consulta por centro de custo.
4. **O que mudou?** Carrossel de políticas ⚠ exemplo.
5. **Dúvidas frequentes:** accordion ⚠ exemplo, mais o card "Não encontrou sua resposta?".
6. **Novidades:** pílulas #1–#9 como cards ("Disponível" leva à seção correspondente; "Em breve").

Saíram da página: os pilares, "Depois dos 30 dias" e o calendário semanal. O cronograma da Comunicação continua em `data.js` (`producao`, `semanas`), mas não aparece na página.

## Fontes
- **Pontos Focais CSC:** aba "Ponto Focais - CSC" (Anotacoes Transicao.xlsx). A coluna "Responsável pela área" está vazia e aparece como `a definir`. Backup, canal e SLA não existem na planilha; os campos aparecem quando preenchidos.
- **Alçadas FlyTour:** aba "Alçadas Aprovação - Flytour".
  - Mostrado: centro de custo → novo aprovador (coluna "Substituto"), com o aprovador anterior riscado e "Viagens do próprio aprovador".
  - O status "Em validação" vem do "validar" da planilha. Quando validar, use `alcadas.status: "vigente"`.
  - Ficaram de fora as métricas internas (nº de regras, %), as notas de diagnóstico e a linha de exclusão de usuário.
  - Os nomes foram passados para caixa normal. "Jucaí" foi mantido como está na planilha.
- **Abas não usadas:** "Festa Celebração", "Zonas Cinzentas" (entrevistas internas) e as abas vazias.

## Publicar vídeo
Em `data.js → video`, use `embed` (toca na página) ou `url` (abre em nova aba), e `thumb` para a capa.

## Links diretos
`#quem-procurar`, `#quem-aprova`, `#alcadas` (abre a consulta), `#politicas`, `#duvidas`, `#novidades`.

## Iframe
```html
<iframe src="https://SEU-USUARIO.github.io/SEU-REPO/transicao/" title="Transição em Foco" style="width:100%;height:900px;border:0"></iframe>
```
