import { useMemo, useState } from "react";
import type { Participant } from "../types/participant";
import type { WordSearchResult } from "../utils/wordSearchGenerator";
import {
  appendSelectionCell,
  isValidSelection,
  type GridCell
} from "../utils/wordSearchSelection";

interface WordSearchProps {
  participant: Participant;
  wordSearch: WordSearchResult;
  foundWords: string[];
  onWordFound: (word: string) => void;
  onOpenHint: () => void;
  hintAvailable: boolean;
}

function cellKey(cell: GridCell): string {
  return `${cell.row}-${cell.col}`;
}

export function WordSearch({
  participant,
  wordSearch,
  foundWords,
  onWordFound,
  onOpenHint,
  hintAvailable
}: WordSearchProps) {
  const [selection, setSelection] = useState<GridCell[]>([]);

  const foundCells = useMemo(() => {
    const map = new Set<string>();

    for (const placement of wordSearch.placements) {
      if (foundWords.includes(placement.word)) {
        placement.cells.forEach((cell) => map.add(cellKey(cell)));
      }
    }

    return map;
  }, [foundWords, wordSearch.placements]);

  const previewCells = useMemo(() => new Set(selection.map(cellKey)), [selection]);

  const handleCellClick = (cell: GridCell) => {
    setSelection((current) => {
      const nextSelection = appendSelectionCell(current, cell);
      const word = isValidSelection(nextSelection, wordSearch.placements);

      if (word && !foundWords.includes(word)) {
        onWordFound(word);
        return [];
      }

      return nextSelection;
    });
  };

  return (
    <section className="card puzzle-card" aria-labelledby="puzzle-title">
      <header className="puzzle-card__header">
        <div>
          <h2 id="puzzle-title">Caça-palavras</h2>
          <p>Encontre as palavras escondidas para continuar.</p>
        </div>
        <p className="puzzle-card__counter">
          Palavras encontradas: {foundWords.length} / {participant.words.length}
        </p>
      </header>

      <div className="word-search" role="grid" aria-label="Caça-palavras">
        {wordSearch.grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cell = { row: rowIndex, col: colIndex };
            const isFound = foundCells.has(cellKey(cell));
            const isPreview = previewCells.has(cellKey(cell));

            return (
              <button
                key={cellKey(cell)}
                type="button"
                className={[
                  "word-search__cell",
                  isFound ? "word-search__cell--found" : "",
                  isPreview ? "word-search__cell--selected" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                role="gridcell"
                aria-label={`Letra ${letter}`}
                onClick={() => handleCellClick(cell)}
                aria-pressed={isPreview}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      <div className="puzzle-actions">
        {hintAvailable ? (
          <button type="button" className="secondary-action" onClick={onOpenHint}>
            Está difícil? Exibir ajuda
          </button>
        ) : (
          <span className="puzzle-card__hint">A ajuda aparece depois de alguns segundos.</span>
        )}
      </div>
    </section>
  );
}
