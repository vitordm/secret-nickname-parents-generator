import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Participant } from "../types/participant";
import { WordSearch } from "./WordSearch";

const participant: Participant = {
  id: "test",
  displayName: "Teste",
  aliases: ["teste"],
  words: ["VOVO"],
  nickname: "Vovô",
  participantImage: "/participants/eduardo.svg",
  generatedImage: "/generated/eduardo.svg",
  resultMessage: "Teste",
  finalMessage: "Teste"
};

const wordSearch = {
  grid: [
    ["V", "O", "V", "O", "A", "B", "C", "D"],
    ["E", "F", "G", "H", "I", "J", "K", "L"],
    ["M", "N", "O", "P", "Q", "R", "S", "T"],
    ["U", "V", "W", "X", "Y", "Z", "A", "B"],
    ["C", "D", "E", "F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O", "P", "Q", "R"],
    ["S", "T", "U", "V", "W", "X", "Y", "Z"],
    ["A", "B", "C", "D", "E", "F", "G", "H"]
  ],
  placements: [
    {
      word: "VOVO",
      cells: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 }
      ]
    }
  ]
};

describe("WordSearch", () => {
  it("mantém cada clique na seleção até completar a palavra", () => {
    const onWordFound = vi.fn();

    render(
      <WordSearch
        participant={participant}
        wordSearch={wordSearch}
        foundWords={[]}
        onWordFound={onWordFound}
        onOpenHint={vi.fn()}
        hintAvailable={false}
      />
    );

    const cells = screen.getAllByRole("gridcell");

    fireEvent.click(cells[0]);
    expect(cells[0]).toHaveClass("word-search__cell--selected");

    fireEvent.click(cells[1]);
    expect(cells[0]).toHaveClass("word-search__cell--selected");
    expect(cells[1]).toHaveClass("word-search__cell--selected");

    fireEvent.click(cells[2]);
    fireEvent.click(cells[3]);

    expect(onWordFound).toHaveBeenCalledWith("VOVO");
  });
});
