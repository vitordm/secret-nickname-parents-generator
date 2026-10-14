import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGame } from "./useGame";

describe("useGame", () => {
  it("inicia em WELCOME", () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.step).toBe("WELCOME");
  });
});
