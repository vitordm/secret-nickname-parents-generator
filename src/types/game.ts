import type { Participant } from "./participant";
import type { WordSearchResult } from "../utils/wordSearchGenerator";

export type GameStep =
  | "WELCOME"
  | "LOADING"
  | "WORD_SEARCH"
  | "HINT"
  | "RESULT"
  | "FINAL_REVEAL";

export interface GameState {
  step: GameStep;
  inputName: string;
  selectedParticipant?: Participant;
  wordSearch?: WordSearchResult;
  loadingProgress: number;
  loadingMessage: string;
  hintAvailable: boolean;
  resultVisible: boolean;
  finalVisible: boolean;
  wordsFound: string[];
  isAudioOn: boolean;
  participantNotFound: boolean;
}
