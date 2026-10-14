import { describe, expect, it } from "vitest";
import participants from "../data/participants.json";
import { findParticipant } from "./findParticipant";

describe("findParticipant", () => {
  it("encontra pelo nome com alias e acento", () => {
    const participant = findParticipant("  Édu  ", participants.participants);
    expect(participant?.id).toBe("eduardo");
  });
});
