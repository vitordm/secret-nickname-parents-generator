export interface WordPlacement {
  word: string;
  cells: Array<{ row: number; col: number }>;
}

export interface WordSearchResult {
  grid: string[][];
  placements: WordPlacement[];
}

type Direction = { row: number; col: number };

const DIRECTIONS: Direction[] = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 }
];

function normalizeWord(word: string): string {
  return word
    .toUpperCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "");
}

function createEmptyGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
}

function randomLetter(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

function shuffle<T>(items: T[]): T[] {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function canPlace(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction
): boolean {
  const size = grid.length;

  for (let index = 0; index < word.length; index += 1) {
    const nextRow = row + direction.row * index;
    const nextCol = col + direction.col * index;

    if (nextRow < 0 || nextCol < 0 || nextRow >= size || nextCol >= size) {
      return false;
    }

    const existing = grid[nextRow][nextCol];
    if (existing !== "" && existing !== word[index]) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction
): WordPlacement {
  const cells: Array<{ row: number; col: number }> = [];

  for (let index = 0; index < word.length; index += 1) {
    const nextRow = row + direction.row * index;
    const nextCol = col + direction.col * index;
    grid[nextRow][nextCol] = word[index];
    cells.push({ row: nextRow, col: nextCol });
  }

  return { word, cells };
}

export function generateWordSearch(words: string[], size = 8): WordSearchResult {
  const grid = createEmptyGrid(size);
  const placements: WordPlacement[] = [];
  const normalizedWords = words.map(normalizeWord).filter(Boolean);

  for (const word of normalizedWords) {
    const directions = shuffle(DIRECTIONS);
    let placed = false;

    for (let attempt = 0; attempt < 200 && !placed; attempt += 1) {
      const direction = directions[attempt % directions.length];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (!canPlace(grid, word, row, col, direction)) {
        continue;
      }

      placements.push(placeWord(grid, word, row, col, direction));
      placed = true;
    }

    if (!placed) {
      throw new Error(`Unable to place word: ${word}`);
    }
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (grid[row][col] === "") {
        grid[row][col] = randomLetter();
      }
    }
  }

  return { grid, placements };
}
