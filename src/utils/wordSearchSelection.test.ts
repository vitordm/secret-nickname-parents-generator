import { describe, expect, it } from "vitest";
import { appendSelectionCell } from "./wordSearchSelection";

describe("appendSelectionCell", () => {
  it("mantém cada letra clicada na seleção quando elas seguem uma linha reta", () => {
    const first = { row: 0, col: 0 };
    const second = { row: 0, col: 1 };
    const third = { row: 0, col: 2 };

    const afterFirst = appendSelectionCell([], first);
    const afterSecond = appendSelectionCell(afterFirst, second);
    const afterThird = appendSelectionCell(afterSecond, third);

    expect(afterFirst).toEqual([first]);
    expect(afterSecond).toEqual([first, second]);
    expect(afterThird).toEqual([first, second, third]);
  });
});
