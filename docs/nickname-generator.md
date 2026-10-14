# Gerador de Apelidos – Plano de Implementação

## 1. Visão Geral do Projeto

O **Gerador de Apelidos** será um pequeno jogo interativo criado para revelar uma gravidez de maneira divertida, personalizada e emocionante.

Inicialmente, o site deve parecer apenas um jogo simples que irá descobrir um novo apelido para a pessoa.

O verdadeiro objetivo do jogo deve permanecer escondido até as etapas finais.

Cada participante terá um resultado previamente configurado, como:

- Vovô
- Vovó
- Titio
- Titia
- Bisavô
- Bisavó

A experiência combinará um caça palavras personalizado, fotos dos participantes, imagens geradas por IA e uma revelação final.

A aplicação será desenvolvida utilizando **React + TypeScript + Vite** e publicada como um site estático através do **GitHub Pages**.

Não será necessário backend ou banco de dados.

---

# 2. Objetivos Principais

A aplicação deverá:

1. Solicitar o nome da pessoa.
2. Identificar o participante através de uma configuração local em JSON.
3. Exibir uma tela de análise/carregamento simulada.
4. Gerar um caça palavras personalizado.
5. Esconder no caça palavras o futuro apelido daquela pessoa.
6. Permitir que o participante encontre as palavras selecionando as letras.
7. Disponibilizar uma ajuda após alguns segundos.
8. Mostrar uma imagem gerada por IA da própria pessoa segurando um bebê.
9. Permitir revelar o resultado manualmente caso a pessoa não encontre as palavras.
10. Mostrar o novo apelido.
11. Fazer a revelação da gravidez.
12. Opcionalmente mostrar uma imagem da ultrassonografia na revelação final.

A experiência deverá ser pensada principalmente para dispositivos móveis.

---

# 3. Tecnologias

Utilizar:

- React
- TypeScript
- Vite
- CSS
- GitHub Pages
- GitHub Actions para deploy

Evitar dependências desnecessárias.

O projeto deverá ser simples o suficiente para executar com:

```bash
npm install
npm run dev
```

E gerar a versão de produção com:

```bash
npm run build
```

---

# 4. Estrutura Sugerida

```text
nickname-generator/
│
├── public/
│   ├── participants/
│   │   ├── eduardo.png
│   │   ├── leonardo.png
│   │   └── ...
│   │
│   ├── generated/
│   │   ├── eduardo.png
│   │   ├── leonardo.png
│   │   └── ...
│   │
│   ├── ultrasound/
│   │   └── baby.png
│   │
│   └── audio/
│       └── reveal.mp3
│
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── WordSearch.tsx
│   │   ├── Hint.tsx
│   │   ├── ResultReveal.tsx
│   │   └── FinalReveal.tsx
│   │
│   ├── data/
│   │   └── participants.json
│   │
│   ├── hooks/
│   │   └── useGame.ts
│   │
│   ├── types/
│   │   ├── participant.ts
│   │   └── game.ts
│   │
│   ├── utils/
│   │   ├── normalizeName.ts
│   │   └── wordSearchGenerator.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 5. Configuração dos Participantes

Os participantes deverão ser configurados através de um arquivo JSON.

Exemplo:

```json
{
  "participants": [
    {
      "id": "eduardo",
      "displayName": "Eduardo",
      "aliases": [
        "eduardo",
        "edu",
        "dudu"
      ],
      "words": [
        "VOVÔ",
        "VÔ"
      ],
      "nickname": "Vovô",
      "participantImage": "/participants/eduardo.png",
      "generatedImage": "/generated/eduardo.png",
      "message": "Alguém muito especial terá uma nova maneira de chamar você em breve."
    },
    {
      "id": "leonardo",
      "displayName": "Leonardo",
      "aliases": [
        "leonardo",
        "leo"
      ],
      "words": [
        "TITIO",
        "TIO"
      ],
      "nickname": "Titio",
      "participantImage": "/participants/leonardo.png",
      "generatedImage": "/generated/leonardo.png",
      "message": "Parece que alguém bem pequenininho está prestes a ganhar um tio muito especial."
    }
  ]
}
```

O jogo nunca deverá depender diretamente do nome dos participantes dentro dos componentes React.

Para adicionar uma nova pessoa deverá ser necessário apenas:

1. Adicionar a pessoa ao `participants.json`.
2. Adicionar sua foto original.
3. Adicionar sua imagem gerada por IA.

Nenhuma alteração no código da aplicação deverá ser necessária.

---

# 6. Normalização dos Nomes

O nome informado pelo usuário deverá ser normalizado antes da busca.

Por exemplo:

```text
Eduardo
EDUARDO
eduardo
Éduardo
 eduardo
```

Deverão ser tratados de maneira equivalente sempre que possível.

A normalização deverá:

- Converter para letras minúsculas.
- Remover espaços no início e no final.
- Remover acentos.
- Remover espaços duplicados.

Por exemplo:

```ts
normalizeName("  ÉDUARDO  ")
```

Deverá resultar em:

```text
eduardo
```

Os aliases cadastrados no JSON também deverão passar pela mesma normalização antes da comparação.

---

# 7. Fluxo do Jogo

A aplicação poderá utilizar uma máquina de estados simples.

Estados sugeridos:

```ts
type GameStep =
  | "WELCOME"
  | "LOADING"
  | "WORD_SEARCH"
  | "HINT"
  | "RESULT"
  | "FINAL_REVEAL";
```

Fluxo esperado:

```text
WELCOME
   ↓
LOADING
   ↓
WORD_SEARCH
   ↓
HINT (opcional)
   ↓
RESULT
   ↓
FINAL_REVEAL
```

---

# 8. Etapa 1 – Tela Inicial

A primeira página não deverá conter referências a:

- Bebê
- Gravidez
- Avós
- Família aumentando
- Anúncio familiar

Ela deverá parecer apenas um gerador de apelidos.

Conteúdo sugerido:

```text
Descubra seu novo apelido

Criamos um pequeno jogo para descobrir
como as pessoas vão chamar você daqui para frente.

Digite seu nome para começar.
```

Campo:

```text
Seu nome

[________________________]

[ Descobrir meu apelido ]
```

Ao enviar:

1. Normalizar o nome informado.
2. Procurar pelos aliases dos participantes.
3. Armazenar o participante encontrado.
4. Avançar para a tela de carregamento.

---

# 9. Participante Não Encontrado

Caso o nome não seja reconhecido, a aplicação não deverá mostrar os nomes válidos.

Mostrar apenas uma mensagem genérica:

```text
Hmm...

Não encontramos nenhum apelido preparado para esse nome.

Confira se digitou corretamente e tente novamente.
```

Botão:

```text
[ Tentar novamente ]
```

A lista de participantes cadastrados nunca deverá aparecer na interface.

---

# 10. Etapa 2 – Carregamento

Exibir uma falsa análise durante aproximadamente 2 a 3 segundos.

Por exemplo:

```text
Criando seu novo apelido...

Analisando personalidade...
Consultando nossos registros secretos...
Calculando compatibilidade...
Quase lá...
```

Pode existir uma barra de progresso:

```text
████████████░░░░ 76%
```

Todo o progresso será simulado localmente.

Nenhuma requisição externa será necessária.

---

# 11. Etapa 3 – Gerador do Caça Palavras

O caça palavras deverá ser gerado dinamicamente com base no participante selecionado.

Exemplo:

```json
"words": ["VOVÔ", "VÔ"]
```

O algoritmo deverá criar uma matriz aleatória contendo essas palavras.

Tamanho inicial recomendado:

```text
8 x 8
```

A implementação deverá permitir alterar facilmente esse tamanho posteriormente.

Inicialmente, as palavras poderão aparecer:

- Horizontalmente
- Verticalmente
- Diagonalmente

Dar preferência às palavras escritas na ordem normal para não tornar o jogo desnecessariamente difícil.

As posições restantes deverão ser preenchidas com letras aleatórias.

---

# 12. Seleção das Palavras

O caça palavras deverá funcionar com:

- Mouse
- Touch

Isso é importante porque provavelmente a maioria das pessoas abrirá o jogo pelo celular.

O usuário deverá poder:

1. Pressionar a primeira letra.
2. Arrastar sobre as demais letras.
3. Soltar na última letra.

Uma seleção válida deverá permanecer destacada.

Uma seleção inválida deverá ser removida.

Quando uma palavra configurada for encontrada, ela deverá ser marcada.

Por exemplo:

```text
Palavras encontradas: 1 / 2
```

---

# 13. Conclusão do Caça Palavras

Quando todas as palavras forem encontradas, avançar automaticamente para a revelação do resultado.

A transição não deverá ser imediata.

Utilizar aproximadamente:

```text
800–1500 ms
```

Isso permitirá que a pessoa tenha tempo de perceber o que acabou de encontrar.

Essa pequena pausa é importante para a experiência.

---

# 14. Temporizador da Ajuda

Ao abrir o caça palavras, iniciar um temporizador.

Depois de aproximadamente:

```text
5 segundos
```

mostrar:

```text
Está difícil?

[ Exibir ajuda ]
```

O botão deverá aparecer utilizando uma animação suave de fade.

Antes do tempo definido, o botão não deverá estar visível.

---

# 15. Etapa 4 – Ajuda

Quando a pessoa clicar em **Exibir ajuda**, mostrar sua imagem gerada por IA.

Layout desktop:

```text
┌──────────────────┐    ┌──────────────────┐
│                  │    │                  │
│  CAÇA PALAVRAS   │    │   IMAGEM IA      │
│                  │    │                  │
│                  │    │ Pessoa segurando │
│                  │    │ um bebê          │
└──────────────────┘    └──────────────────┘
```

Layout mobile:

```text
┌──────────────────┐
│  CAÇA PALAVRAS   │
└──────────────────┘

┌──────────────────┐
│    IMAGEM IA     │
│                  │
│ Pessoa + bebê    │
└──────────────────┘
```

Não explicar imediatamente o significado da imagem.

A própria imagem será a pista.

O objetivo aqui é criar aquele momento de:

```text
"Peraí..."
```

---

# 16. Botão Para Revelar o Resultado

Após a imagem de ajuda permanecer visível por aproximadamente 2 a 3 segundos, mostrar:

```text
[ Exibir meu apelido ]
```

Isso evita que alguém fique preso no caça palavras.

Clicar nesse botão deverá produzir o mesmo resultado que encontrar todas as palavras.

---

# 17. Etapa 5 – Revelação do Apelido

O caça palavras deverá desaparecer através de uma transição suave.

Primeiro mostrar:

```text
Eduardo...
```

Pequena pausa.

Depois:

```text
Encontramos seu novo apelido.
```

Outra pequena pausa.

Finalmente:

```text
VOVÔ ❤️
```

Ou o apelido configurado para aquele participante.

Exemplo:

```text
Seu novo apelido é...

VOVÔ ❤️
```

O apelido deverá ser o principal elemento visual da tela.

---

# 18. Etapa 6 – Revelação da Gravidez

Não explicar imediatamente o motivo do apelido.

Depois da revelação, mostrar:

```text
[ Por quê? ]
```

Ao clicar, iniciar a sequência final.

Primeiro:

```text
Porque nossa família está prestes a aumentar...
```

Pausa.

Depois:

```text
+1
```

Pausa.

Então:

```text
Estamos esperando um bebê. ❤️
```

E finalmente:

```text
VOCÊ VAI SER VOVÔ!
```

Essa mensagem deverá depender do participante.

Por exemplo:

```json
{
  "finalMessage": "VOCÊ VAI SER VOVÔ!"
}
```

Outro participante:

```json
{
  "finalMessage": "VOCÊ VAI SER TITIO!"
}
```

Dessa forma, o mesmo fluxo funciona para qualquer grau de parentesco.

---

# 19. Revelação da Ultrassonografia

A tela final poderá opcionalmente mostrar uma imagem da ultrassonografia.

A configuração deverá permitir ativar ou desativar esse comportamento.

Por exemplo:

```json
{
  "showUltrasound": true
}
```

Quando habilitado:

```text
Estamos esperando um bebê.

❤️

[ FOTO DA ULTRASSONOGRAFIA ]

Chegando em 2027
```

A ultrassonografia deverá aparecer apenas na revelação final.

Ela não deverá aparecer visualmente em nenhuma etapa anterior.

---

# 20. Áudio

O áudio deverá ser opcional.

Navegadores, especialmente no celular, normalmente bloqueiam reprodução automática de áudio.

Por isso, a música deverá começar somente depois de alguma interação do usuário.

Por exemplo, ao clicar:

```text
[ Por quê? ]
```

A música poderá começar suavemente.

Adicionar também um controle para:

```text
🔊 / 🔇
```

A experiência deverá continuar funcionando perfeitamente mesmo sem áudio.

---

# 21. Animações

As animações deverão ser sutis.

Utilizar principalmente:

- Fade in
- Fade out
- Scale
- Blur para foco
- Revelação gradual das imagens
- Destaque das letras
- Pequenas animações de coração

Evitar exageros como:

- Confetes constantes
- Elementos piscando
- Animações muito rápidas
- Elementos pulando constantemente
- Excesso de efeitos

A revelação final deverá parecer emocional e pessoal, não uma propaganda.

---

# 22. Design Responsivo

A aplicação deverá ser desenvolvida utilizando abordagem mobile-first.

Dispositivos alvo:

- iPhone
- Android
- Tablets
- Navegadores desktop

Viewport mínimo recomendado:

```text
320px
```

O caça palavras deverá permanecer jogável mesmo em telas pequenas.

As letras precisam possuir áreas de toque suficientemente grandes para serem utilizadas confortavelmente com os dedos.

---

# 23. Privacidade

Todas as informações dos participantes estarão dentro da aplicação estática.

Como o GitHub Pages disponibiliza arquivos estáticos publicamente, devemos assumir que alguém com conhecimento técnico poderá acessar diretamente:

```text
participants.json
participants/
generated/
```

Portanto, nenhuma informação sensível deverá ser armazenada.

As fotos utilizadas no projeto também deverão ser consideradas potencialmente acessíveis através da URL.

Se o repositório for público, todo o conteúdo incluído nele deverá ser tratado como público.

---

# 24. Evitar Spoilers

Evitar qualquer referência à gravidez em:

- Nome do repositório
- Título da página
- Metadata HTML
- Open Graph
- Nome das imagens
- URLs
- Nome das pastas públicas quando possível

Bom:

```text
nickname-generator
```

Ruim:

```text
pregnancy-announcement
grandparents-surprise
baby-reveal
```

O título da aba deverá ser algo como:

```text
Gerador de Apelidos
```

A prévia exibida ao compartilhar o link pelo WhatsApp também deverá parecer apenas um jogo.

Não utilizar imagem de bebê, coração ou ultrassonografia na imagem de preview do link.

---

# 25. Acessibilidade

Implementar acessibilidade básica.

Requisitos:

- Botões acessíveis pelo teclado.
- Estados de foco visíveis.
- Contraste adequado.
- Texto alternativo nas imagens.
- Utilização de `aria-label` quando necessário.
- Não depender apenas de cores para transmitir informações.

O caça palavras poderá permitir clicar individualmente nas letras como alternativa ao gesto de arrastar.

---

# 26. Deploy no GitHub Pages

Utilizar GitHub Actions para fazer deploy automaticamente.

Fluxo:

```text
Push para main
      ↓
GitHub Actions
      ↓
npm install
      ↓
npm run build
      ↓
Deploy de dist/
      ↓
GitHub Pages
```

A configuração `base` do Vite deverá considerar o caminho utilizado pelo GitHub Pages.

Por exemplo:

```ts
export default defineConfig({
  base: "/nickname-generator/",
});
```

O valor deverá corresponder ao nome real do repositório.

---

# 27. Fases de Desenvolvimento

## Fase 1 – Fundação

Implementar:

- Vite
- React
- TypeScript
- CSS inicial
- Estados da aplicação
- Tipos dos participantes
- Configuração JSON
- Normalização dos nomes

Objetivo:

A aplicação consegue identificar uma pessoa e carregar sua configuração.

---

## Fase 2 – Fluxo Principal

Implementar:

```text
Tela inicial
↓
Loading
↓
Caça palavras
↓
Resultado
```

Não focar excessivamente em animações nesta etapa.

Objetivo:

Ter o fluxo funcional de ponta a ponta.

---

## Fase 3 – Caça Palavras

Implementar:

- Geração da matriz
- Posicionamento das palavras
- Letras aleatórias
- Seleção com mouse
- Seleção por touch
- Validação
- Palavras encontradas
- Conclusão do puzzle

Objetivo:

Ter um caça palavras completamente funcional tanto no desktop quanto no celular.

---

## Fase 4 – Sistema de Ajuda

Implementar:

- Timer de 5 segundos
- Botão `Exibir ajuda`
- Imagem gerada por IA
- Layout responsivo entre puzzle e imagem
- Botão para revelar o resultado

Objetivo:

Garantir que ninguém fique preso no jogo.

---

## Fase 5 – Revelação

Implementar a sequência:

```text
Apelido
↓
Por quê?
↓
Nossa família vai aumentar
↓
+1
↓
Anúncio da gravidez
↓
Mensagem personalizada
↓
Ultrassonografia
```

Adicionar pausas e transições controladas.

Objetivo:

Transformar uma simples resposta do jogo em uma revelação emocional.

---

## Fase 6 – Refinamento Visual

Melhorar:

- Tipografia
- Animações
- Background
- Botões
- Seleção das letras
- Transições das imagens
- Experiência mobile
- Revelação final

As telas iniciais deverão utilizar uma identidade visual relativamente neutra.

Conforme a pessoa se aproxima da revelação, o visual poderá gradualmente ficar mais acolhedor.

---

## Fase 7 – GitHub Pages

Implementar:

- Build de produção
- GitHub Actions
- Configuração do `base` do Vite
- GitHub Pages
- Testes em dispositivos móveis

Objetivo:

Ter uma única URL pronta para ser compartilhada.

---

# 28. Checklist de Testes

Antes de enviar o link para alguém, testar:

- Nomes cadastrados.
- Apelidos/aliases.
- Letras maiúsculas e minúsculas.
- Nomes com acentos.
- Nomes desconhecidos.
- Geração do caça palavras.
- Presença de todas as palavras configuradas.
- Seleção com touch.
- Seleção com mouse.
- Timer da ajuda.
- Imagens geradas.
- Revelação manual.
- Revelação automática.
- Mensagem personalizada.
- Ultrassonografia.
- Controle de áudio.
- Atualização da página.
- Safari no iPhone.
- Chrome no Android.
- Chrome/Edge/Firefox no desktop.
- URL final do GitHub Pages.

Também deverá ser realizado um teste completo utilizando **cada participante cadastrado**.

---

# 29. Modelo de Dados

Modelo sugerido:

```ts
export interface Participant {
  id: string;
  displayName: string;
  aliases: string[];

  words: string[];

  nickname: string;

  participantImage: string;
  generatedImage: string;

  resultMessage: string;
  finalMessage: string;

  showUltrasound?: boolean;
}
```

Exemplo:

```json
{
  "id": "eduardo",
  "displayName": "Eduardo",
  "aliases": [
    "eduardo",
    "edu",
    "dudu"
  ],
  "words": [
    "VOVÔ",
    "VÔ"
  ],
  "nickname": "Vovô",
  "participantImage": "/participants/eduardo.png",
  "generatedImage": "/generated/eduardo.png",
  "resultMessage": "Alguém muito especial terá uma nova maneira de chamar você em breve.",
  "finalMessage": "Você vai ser vovô!",
  "showUltrasound": true
}
```

---

# 30. Regra Importante de Implementação

Todo comportamento específico de um participante deverá ser orientado pelos dados.

Evitar código como:

```ts
if (name === "eduardo") {
  nickname = "Vovô";
}
```

Utilizar:

```ts
const participant = findParticipant(name);
```

A partir desse ponto, todas as informações deverão vir do objeto:

```ts
participant.words
participant.nickname
participant.generatedImage
participant.resultMessage
participant.finalMessage
```

Isso permitirá adicionar novas pessoas sem alterar a lógica da aplicação.

---

# 31. MVP

A primeira versão utilizável deverá possuir:

- Configuração dos participantes em JSON
- Identificação pelo nome
- Loading simulado
- Caça palavras dinâmico
- Suporte a mouse
- Suporte a touch
- Palavras personalizadas por participante
- Ajuda após 5 segundos
- Imagem da pessoa gerada por IA
- Botão para revelar resultado
- Revelação do apelido
- Revelação da gravidez
- Layout responsivo
- Deploy pelo GitHub Pages

Áudio, ultrassonografia, animações mais avançadas e efeitos adicionais poderão ser adicionados depois que o MVP estiver estável.

---

# 32. Experiência Desejada

A progressão emocional esperada deverá ser:

```text
Curiosidade
   ↓
"É só um joguinho"
   ↓
Concentração
   ↓
Estranheza
   ↓
"Peraí..."
   ↓
Desconfiança
   ↓
VOVÔ / VOVÓ / TITIO / TITIA
   ↓
Cai a ficha
   ↓
Anúncio da gravidez
   ↓
❤️
```

A implementação deverá proteger essa progressão.

O caça palavras é apenas o mecanismo utilizado para chegar à revelação.

O principal objetivo da experiência é controlar **o momento exato em que a pessoa percebe o verdadeiro significado do jogo**.