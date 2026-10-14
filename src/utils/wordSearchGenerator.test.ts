import { describe, expect, it } from "vitest";
import { generateWordSearch } from "./wordSearchGenerator";

describe("generateWordSearch", () => {
  it("posiciona todas as palavras e preenche a grade", () => {
    const result = generateWordSearch(["VOVO", "VO"], 8);
    expect(result.grid).toHaveLength(8);
    expect(result.placements).toHaveLength(2);
    expect(result.grid.every((row) => row.every((cell) => cell.length === 1))).toBe(true);
  });
});
