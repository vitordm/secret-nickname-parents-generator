import type { WordPlacement } from "./wordSearchGenerator";

export interface GridCell {
  row: number;
  col: number;
}

export function buildSelectionPath(start: GridCell, end: GridCell): GridCell[] | null {
  const deltaRow = end.row - start.row;
  const deltaCol = end.col - start.col;
  const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));

  if (steps === 0) {
    return [start];
  }

  const stepRow = deltaRow === 0 ? 0 : deltaRow / steps;
  const stepCol = deltaCol === 0 ? 0 : deltaCol / steps;

  if (!Number.isInteger(stepRow) || !Number.isInteger(stepCol)) {
    return null;
  }

  const path: GridCell[] = [];
  for (let index = 0; index <= steps; index += 1) {
    path.push({
      row: start.row + stepRow * index,
      col: start.col + stepCol * index
    });
  }

  return path;
}

function matchesCells(left: GridCell[], right: GridCell[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((cell, index) => cell.row === right[index].row && cell.col === right[index].col);
}

export function isValidSelection(
  selection: GridCell[],
  placements: WordPlacement[]
): string | null {
  for (const placement of placements) {
    if (matchesCells(selection, placement.cells)) {
      return placement.word;
    }

    const reversed = [...placement.cells].reverse();
    if (matchesCells(selection, reversed)) {
      return placement.word;
    }
  }

  return null;
}

export function appendSelectionCell(
  currentSelection: GridCell[],
  nextCell: GridCell
): GridCell[] {
  if (currentSelection.length === 0) {
    return [nextCell];
  }

  const firstCell = currentSelection[0];
  const candidatePath = buildSelectionPath(firstCell, nextCell);

  if (!candidatePath) {
    return [nextCell];
  }

  if (candidatePath.length === currentSelection.length + 1) {
    const matchesCurrent = currentSelection.every(
      (cell, index) => cell.row === candidatePath[index].row && cell.col === candidatePath[index].col
    );

    if (matchesCurrent) {
      return candidatePath;
    }
  }

  if (candidatePath.length === 1) {
    return [nextCell];
  }

  return [nextCell];
}
