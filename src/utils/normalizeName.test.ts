import { describe, expect, it } from "vitest";
import { normalizeName } from "./normalizeName";

describe("normalizeName", () => {
  it("remove acentos, espaços extras e maiúsculas", () => {
    expect(normalizeName("  ÉDUARDO  ")).toBe("eduardo");
  });
});
