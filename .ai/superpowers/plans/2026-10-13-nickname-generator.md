# Gerador de Apelidos Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir um site estático em React + TypeScript + Vite que identifica uma pessoa por nome, gera um caça-palavras personalizado e conduz uma revelação gradual até o anúncio final.

**Architecture:** Aplicação SPA mobile-first, controlada por uma máquina de estados local (`WELCOME`, `LOADING`, `WORD_SEARCH`, `HINT`, `RESULT`, `FINAL_REVEAL`). Os dados de cada pessoa vivem em `participants.json`, enquanto a lógica do jogo fica em utilitários puros e um hook central (`useGame`). Isso mantém o fluxo previsível, facilita testes e evita código específico por nome.

**Tech Stack:** React, TypeScript, Vite, CSS, GitHub Pages, GitHub Actions, Vitest, Testing Library

## Global Constraints
- Não usar backend nem banco de dados.
- Todo comportamento específico de participante deve vir de `src/data/participants.json`.
- O jogo deve funcionar bem em mobile e desktop, com suporte real a touch e teclado.
- O visual inicial não deve entregar gravidez, bebê, avós ou anúncio familiar.
- O título da página, metadata e preview devem parecer um jogo neutro.
- O build de produção deve funcionar com o caminho base do GitHub Pages.
- Evitar dependências desnecessárias.

---

### Task 1: Scaffolding do projeto e base de testes

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `public/participants/`
- Create: `public/generated/`
- Create: `public/ultrasound/`
- Create: `public/audio/`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `vitest.config.ts`
- Create: `src/setupTests.ts`
- Test: `src/utils/normalizeName.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: app Vite executável, ambiente de teste com Vitest + jsdom, e shell visual inicial.

- [ ] **Step 1: Escrever o teste falhando para normalização**

```ts
import { describe, expect, it } from "vitest";
import { normalizeName } from "./normalizeName";

describe("normalizeName", () => {
  it("remove acentos, espaços extras e maiúsculas", () => {
    expect(normalizeName("  ÉDUARDO  ")).toBe("eduardo");
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar falha**

Run: `npm test -- src/utils/normalizeName.test.ts -v`
Expected: falha porque `normalizeName` ainda não existe.

- [ ] **Step 3: Criar a base do app e scripts**

Definir os scripts principais em `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

Criar `vite.config.ts` com `base` apontando para o caminho do Pages:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/nng/",
  plugins: [react()],
});
```

Configurar `tsconfig.json` para aceitar importação de JSON e JSX do React:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "noEmit": true
  }
}
```

- [ ] **Step 4: Criar a implementação mínima da tela inicial**

`src/App.tsx` deve renderizar apenas um shell neutro com título, input e botão, sem entregar a temática real.

```tsx
export function App() {
  return (
    <main className="app-shell">
      <h1>Gerador de Apelidos</h1>
      <p>Descubra seu novo apelido.</p>
    </main>
  );
}
```

- [ ] **Step 5: Executar os testes e a build**

Run:
- `npm test`
- `npm run build`

Expected: teste de normalização ainda falha até a Task 2; build inicial deve compilar.

---

### Task 2: Modelo de dados, normalização e busca de participante

**Files:**
- Create: `src/types/participant.ts`
- Create: `src/data/participants.json`
- Create: `src/utils/normalizeName.ts`
- Create: `src/utils/findParticipant.ts`
- Create: `public/participants/`
- Create: `public/generated/`
- Create: `public/ultrasound/`
- Create: `public/audio/`
- Test: `src/utils/findParticipant.test.ts`

**Interfaces:**
- Consumes: base do app e ambiente de testes da Task 1.
- Produces: tipos de participante, normalização consistente e lookup por aliases.

- [ ] **Step 1: Escrever o teste falhando para busca por alias**

```ts
import { describe, expect, it } from "vitest";
import participants from "../data/participants.json";
import { findParticipant } from "./findParticipant";

describe("findParticipant", () => {
  it("encontra pelo nome com alias e acento", () => {
    const participant = findParticipant("  Édu  ", participants.participants);
    expect(participant?.id).toBe("eduardo");
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar falha**

Run: `npm test -- src/utils/findParticipant.test.ts -v`
Expected: falha porque `findParticipant` e `participants.json` ainda não existem.

- [ ] **Step 3: Definir os tipos compartilhados**

`src/types/participant.ts`:

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

export interface ParticipantsCatalog {
  participants: Participant[];
}
```

- [ ] **Step 4: Criar o catálogo inicial de participantes**

`src/data/participants.json` deve conter pelo menos duas entradas, por exemplo `eduardo` e `leonardo`, cada uma com `aliases`, `words`, `nickname`, imagens e mensagens.

- [ ] **Step 5: Implementar normalização e lookup**

`src/utils/normalizeName.ts`:

```ts
export function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}
```

`src/utils/findParticipant.ts`:

```ts
import type { Participant } from "../types/participant";
import { normalizeName } from "./normalizeName";

export function findParticipant(
  input: string,
  participants: Participant[]
): Participant | undefined {
  const normalizedInput = normalizeName(input);
  return participants.find((participant) =>
    [participant.displayName, ...participant.aliases].some(
      (alias) => normalizeName(alias) === normalizedInput
    )
  );
}
```

- [ ] **Step 6: Executar testes e validar comportamento**

Run:
- `npm test -- src/utils/normalizeName.test.ts -v`
- `npm test -- src/utils/findParticipant.test.ts -v`

Expected: ambos passam.

---

### Task 3: Máquina de estados, fluxo inicial e loading simulado

**Files:**
- Create: `src/hooks/useGame.ts`
- Create: `src/components/WelcomeScreen.tsx`
- Create: `src/components/LoadingScreen.tsx`
- Create: `src/components/UnknownParticipantScreen.tsx`
- Modify: `src/App.tsx`
- Test: `src/hooks/useGame.test.ts`

**Interfaces:**
- Consumes: `findParticipant`, `Participant`, `normalizeName`.
- Produces: estado central do jogo e transições entre `WELCOME`, `LOADING` e `WORD_SEARCH`.

- [ ] **Step 1: Escrever o teste falhando para o fluxo básico**

```ts
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGame } from "./useGame";

describe("useGame", () => {
  it("inicia em WELCOME", () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.step).toBe("WELCOME");
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar falha**

Run: `npm test -- src/hooks/useGame.test.ts -v`
Expected: falha porque `useGame` ainda não existe.

- [ ] **Step 3: Implementar o hook central**

`src/hooks/useGame.ts` deve expor pelo menos:

```ts
export type GameStep =
  | "WELCOME"
  | "LOADING"
  | "WORD_SEARCH"
  | "HINT"
  | "RESULT"
  | "FINAL_REVEAL";
```

E um estado com:

```ts
{
  step,
  inputName,
  setInputName,
  selectedParticipant,
  startGame,
  loadingProgress,
  loadingMessage,
  resetGame
}
```

- [ ] **Step 4: Conectar App às telas iniciais**

`src/App.tsx` deve:
- mostrar `WelcomeScreen` em `WELCOME`
- mostrar `LoadingScreen` em `LOADING`
- mostrar `UnknownParticipantScreen` quando o nome não bater
- avançar para `WORD_SEARCH` depois do loading

- [ ] **Step 5: Executar testes e fluxo manual**

Run:
- `npm test -- src/hooks/useGame.test.ts -v`
- `npm run dev`

Expected: fluxo entra em `WELCOME`, aceita nome válido e mostra fallback genérico para nome inválido.

---

### Task 4: Gerador do caça-palavras e validação de seleção

**Files:**
- Create: `src/utils/wordSearchGenerator.ts`
- Create: `src/utils/wordSearchSelection.ts`
- Create: `src/components/WordSearch.tsx`
- Test: `src/utils/wordSearchGenerator.test.ts`

**Interfaces:**
- Consumes: lista de palavras do participante.
- Produces: matriz do puzzle, coordenadas das palavras e validação de seleção.

- [ ] **Step 1: Escrever o teste falhando para o gerador**

```ts
import { describe, expect, it } from "vitest";
import { generateWordSearch } from "./wordSearchGenerator";

describe("generateWordSearch", () => {
  it("posiciona todas as palavras e preenche a grade", () => {
    const result = generateWordSearch(["VOVO", "VO"], 8);
    expect(result.grid).toHaveLength(8);
    expect(result.placements).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar falha**

Run: `npm test -- src/utils/wordSearchGenerator.test.ts -v`
Expected: falha porque o gerador ainda não existe.

- [ ] **Step 3: Implementar o gerador puro**

`src/utils/wordSearchGenerator.ts` deve exportar:

```ts
export interface WordPlacement {
  word: string;
  cells: Array<{ row: number; col: number }>;
}

export interface WordSearchResult {
  grid: string[][];
  placements: WordPlacement[];
}

export function generateWordSearch(
  words: string[],
  size = 8
): WordSearchResult;
```

Regras:
- aceitar horizontal, vertical e diagonal
- tentar posicionamento em ordem normal primeiro
- preencher células vazias com letras aleatórias

- [ ] **Step 4: Implementar a camada de seleção**

`src/utils/wordSearchSelection.ts` deve traduzir cliques/toques em seleção contínua de células e comparar o caminho com `placements`.

Interface sugerida:

```ts
export function isValidSelection(
  selection: Array<{ row: number; col: number }>,
  placements: Array<{ word: string; cells: Array<{ row: number; col: number }> }>
): string | null;
```

- [ ] **Step 5: Renderizar o puzzle na UI**

`src/components/WordSearch.tsx` deve:
- mostrar a grade 8x8 inicialmente
- permitir seleção por arrasto e toque
- permitir clique célula a célula como alternativa acessível
- mostrar contador de palavras encontradas

- [ ] **Step 6: Executar testes do gerador**

Run:
- `npm test -- src/utils/wordSearchGenerator.test.ts -v`
- `npm run dev`

Expected: palavras posicionadas, grade preenchida e seleção validável.

---

### Task 5: Ajuda, imagem gerada por IA e revelação manual

**Files:**
- Create: `src/components/Hint.tsx`
- Create: `src/components/RevealButton.tsx`
- Modify: `src/hooks/useGame.ts`
- Modify: `src/App.tsx`
- Test: `src/components/Hint.test.tsx`

**Interfaces:**
- Consumes: estado do jogo, participante selecionado e timer interno.
- Produces: ajuda após 5s, imagem de pista e caminho manual para revelar o apelido.

- [ ] **Step 1: Escrever um teste simples para a visibilidade da ajuda**

```ts
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hint } from "./Hint";

describe("Hint", () => {
  it("não mostra a ajuda antes da liberação", () => {
    render(<Hint visible={false} imageUrl="/generated/eduardo.png" />);
    expect(screen.queryByRole("img")).toBeNull();
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar falha**

Run: `npm test -- src/components/Hint.test.tsx -v`
Expected: falha até `Hint` existir.

- [ ] **Step 3: Implementar o timer de ajuda**

O `useGame` deve iniciar um timer ao entrar em `WORD_SEARCH` e liberar `hintAvailable` após 5 segundos.

- [ ] **Step 4: Implementar `Hint` e o botão manual**

`Hint` deve:
- mostrar a imagem `generatedImage`
- manter a explicação visual implícita
- exibir `[ Exibir meu apelido ]` depois de alguns segundos de visibilidade

`RevealButton` deve disparar a mesma transição de concluir o puzzle.

- [ ] **Step 5: Conectar a revelação manual ao fluxo**

Quando o usuário clicar no botão, o estado deve seguir para `RESULT` como se tivesse completado todas as palavras.

- [ ] **Step 6: Executar testes e revisar mobile**

Run:
- `npm test -- src/components/Hint.test.tsx -v`
- `npm run dev`

Expected: ajuda aparece no tempo certo e o botão manual leva ao mesmo desfecho do puzzle completo.

---

### Task 6: Revelação do apelido, sequência final e áudio opcional

**Files:**
- Create: `src/components/ResultReveal.tsx`
- Create: `src/components/FinalReveal.tsx`
- Create: `src/components/AudioToggle.tsx`
- Modify: `src/hooks/useGame.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: participante selecionado e estado de conclusão.
- Produces: sequência emocional de `RESULT` até `FINAL_REVEAL`, com ultrassom opcional e áudio opcional.

- [ ] **Step 1: Definir a sequência de revelação**

`ResultReveal` deve mostrar:
- nome da pessoa
- pausa curta
- “Encontramos seu novo apelido.”
- pausa curta
- apelido em destaque

`FinalReveal` deve mostrar:
- “Por quê?”
- “Porque nossa família está prestes a aumentar...”
- `+1`
- “Estamos esperando um bebê. ❤️”
- `finalMessage`

- [ ] **Step 2: Implementar a progressão automática**

O `useGame` deve avançar com pequenos atrasos controlados, sem bloquear a UI.

- [ ] **Step 3: Adicionar suporte a ultrassom opcional**

Se `showUltrasound` for `true`, `FinalReveal` renderiza a imagem de ultrassom apenas na última etapa.

- [ ] **Step 4: Adicionar áudio opcional**

`AudioToggle` deve alternar entre ligado e desligado, sem quebrar a experiência se o navegador bloquear autoplay.

- [ ] **Step 5: Validar a sequência completa**

Run:
- `npm run dev`

Expected: a experiência vai do apelido à revelação final sem expor o tema cedo demais.

---

### Task 7: Estilo mobile-first, acessibilidade, deploy e verificação final

**Files:**
- Modify: `src/styles.css`
- Modify: `index.html`
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: app final funcional.
- Produces: visual responsivo, metadata neutra, deploy automático e instruções de uso.

- [ ] **Step 1: Escrever a folha de estilo final**

`src/styles.css` deve cobrir:
- layout mobile-first
- grids com botões grandes o suficiente para toque
- foco visível
- transições suaves
- estados de seleção do puzzle
- responsividade para desktop e tablets

- [ ] **Step 2: Ajustar metadata neutra**

`index.html` deve usar título e descrição sem spoilers, por exemplo:
- título: `Gerador de Apelidos`
- descrição neutra de jogo/interação
- sem imagens de preview que entreguem o tema

- [ ] **Step 3: Criar o workflow do GitHub Pages**

`.github/workflows/deploy.yml` deve:
- rodar em push para `main`
- instalar dependências
- executar `npm run build`
- publicar `dist/`

- [ ] **Step 4: Atualizar README**

Documentar:
- instalação
- desenvolvimento local
- build
- preview
- como atualizar os participantes

- [ ] **Step 5: Verificação final**

Run:
- `npm test`
- `npm run build`

Expected:
- testes verdes
- build gerado com sucesso
- app navegável no mobile e desktop
- deploy pronto para Pages

---

## Coverage Check
- Identificação por nome e aliases: Task 2.
- Normalização de acentos, caixa e espaços: Task 2.
- Loading simulado: Task 3.
- Caça-palavras dinâmico: Task 4.
- Seleção por mouse e touch: Task 4.
- Ajuda após 5 segundos: Task 5.
- Imagem IA de pista: Task 5.
- Revelação manual: Task 5.
- Revelação do apelido: Task 6.
- Revelação da gravidez: Task 6.
- Ultrassom opcional: Task 6.
- Áudio opcional: Task 6.
- Responsividade e acessibilidade: Task 7.
- GitHub Pages: Task 7.

