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
