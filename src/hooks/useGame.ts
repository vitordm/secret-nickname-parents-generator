import { useEffect, useMemo, useRef, useState } from "react";
import participantsData from "../data/participants.json";
import type { ParticipantsCatalog, Participant } from "../types/participant";
import type { GameState, GameStep } from "../types/game";
import { findParticipant } from "../utils/findParticipant";
import { generateWordSearch } from "../utils/wordSearchGenerator";

const catalog = participantsData as ParticipantsCatalog;

const loadingMessages = [
  "Analisando personalidade...",
  "Consultando nossos registros secretos...",
  "Calculando compatibilidade...",
  "Quase lá..."
];

const initialState: GameState = {
  step: "WELCOME",
  inputName: "",
  loadingProgress: 0,
  loadingMessage: "",
  hintAvailable: false,
  resultVisible: false,
  finalVisible: false,
  wordsFound: [],
  isAudioOn: false,
  participantNotFound: false
};

export interface UseGameResult extends GameState {
  submitName: () => boolean;
  setInputName: (value: string) => void;
  resetGame: () => void;
  markWordFound: (word: string) => void;
  openHint: () => void;
  revealResult: () => void;
  revealFinal: () => void;
  toggleAudio: () => void;
}

export function useGame(): UseGameResult {
  const [state, setState] = useState<GameState>(initialState);
  const progressTimerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);

  const selectedParticipant = useMemo(() => {
    if (!state.selectedParticipant) {
      return undefined;
    }

    return state.selectedParticipant;
  }, [state.selectedParticipant]);

  const clearTimers = () => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }

    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimers();

    if (state.step === "LOADING") {
      const messages = [...loadingMessages];
      let messageIndex = 0;

      setState((current) => ({
        ...current,
        loadingProgress: 5,
        loadingMessage: messages[0] ?? ""
      }));

      progressTimerRef.current = window.setInterval(() => {
        setState((current) => {
          const nextProgress = Math.min(current.loadingProgress + 18, 100);
          const nextMessage = messages[Math.min(messageIndex, messages.length - 1)] ?? "";

          messageIndex += 1;

          return {
            ...current,
            loadingProgress: nextProgress,
            loadingMessage: nextMessage
          };
        });
      }, 420);

      revealTimerRef.current = window.setTimeout(() => {
        clearTimers();
        setState((current) => ({
          ...current,
          step: "WORD_SEARCH",
          loadingProgress: 100,
          loadingMessage: "",
          hintAvailable: false,
          resultVisible: false,
          finalVisible: false
        }));
      }, 2400);
    }

    if (state.step === "WORD_SEARCH") {
      hintTimerRef.current = window.setTimeout(() => {
        setState((current) => ({
          ...current,
          hintAvailable: true
        }));
      }, 5000);
    }

    if (state.step === "RESULT") {
      setState((current) => ({
        ...current,
        resultVisible: true
      }));
    }

    if (state.step === "FINAL_REVEAL") {
      setState((current) => ({
        ...current,
        finalVisible: true
      }));
    }

    return clearTimers;
  }, [state.step]);

  const setInputName = (value: string) => {
    setState((current) => ({
      ...current,
      inputName: value,
      participantNotFound: false
    }));
  };

  const submitName = () => {
    const participant = findParticipant(state.inputName, catalog.participants);

    if (!participant) {
      setState((current) => ({
        ...current,
        participantNotFound: true,
        selectedParticipant: undefined,
        step: "WELCOME"
      }));
      return false;
    }

    setState({
      ...initialState,
      inputName: state.inputName,
      selectedParticipant: participant,
      loadingProgress: 0,
      loadingMessage: "Analisando personalidade...",
      wordSearch: generateWordSearch(participant.words, 8),
      participantNotFound: false,
      step: "LOADING"
    });

    return true;
  };

  const resetGame = () => {
    clearTimers();
    setState(initialState);
  };

  const markWordFound = (word: string) => {
    setState((current) => {
      if (current.wordsFound.includes(word)) {
        return current;
      }

      const wordsFound = [...current.wordsFound, word];
      const allFound =
        current.selectedParticipant !== undefined &&
        wordsFound.length >= current.selectedParticipant.words.length;

      if (allFound) {
        window.setTimeout(() => {
          setState((next) => ({
            ...next,
            step: "RESULT",
            resultVisible: true
          }));
        }, 1100);
      }

      return {
        ...current,
        wordsFound
      };
    });
  };

  const openHint = () => {
    setState((current) => ({
      ...current,
      step: "HINT"
    }));
  };

  const revealResult = () => {
    setState((current) => ({
      ...current,
      step: "RESULT",
      resultVisible: true
    }));
  };

  const revealFinal = () => {
    setState((current) => ({
      ...current,
      step: "FINAL_REVEAL",
      finalVisible: true
    }));
  };

  const toggleAudio = () => {
    setState((current) => ({
      ...current,
      isAudioOn: !current.isAudioOn
    }));
  };

  return {
    ...state,
    selectedParticipant,
    submitName,
    setInputName,
    resetGame,
    markWordFound,
    openHint,
    revealResult,
    revealFinal,
    toggleAudio
  };
}
