import { AudioToggle } from "./components/AudioToggle";
import { FinalReveal } from "./components/FinalReveal";
import { Hint } from "./components/Hint";
import { LoadingScreen } from "./components/LoadingScreen";
import { ResultReveal } from "./components/ResultReveal";
import { UnknownParticipantScreen } from "./components/UnknownParticipantScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { WordSearch } from "./components/WordSearch";
import { useGame } from "./hooks/useGame";

export function App() {
  const game = useGame();

  return (
    <main className="app-shell">
      <div className="app-shell__chrome">
        {game.selectedParticipant ? (
          <AudioToggle isOn={game.isAudioOn} onToggle={game.toggleAudio} />
        ) : null}
      </div>

      {game.step === "WELCOME" && !game.participantNotFound ? (
        <WelcomeScreen value={game.inputName} onChange={game.setInputName} onSubmit={game.submitName} />
      ) : null}

      {game.step === "WELCOME" && game.participantNotFound ? (
        <UnknownParticipantScreen onRetry={game.resetGame} />
      ) : null}

      {game.step === "LOADING" ? (
        <LoadingScreen progress={game.loadingProgress} message={game.loadingMessage} />
      ) : null}

      {game.step === "WORD_SEARCH" && game.selectedParticipant && game.wordSearch ? (
        <WordSearch
          participant={game.selectedParticipant}
          wordSearch={game.wordSearch}
          foundWords={game.wordsFound}
          onWordFound={game.markWordFound}
          onOpenHint={game.openHint}
          hintAvailable={game.hintAvailable}
        />
      ) : null}

      {game.step === "HINT" && game.selectedParticipant && game.wordSearch ? (
        <section className="hints-layout">
          <WordSearch
            participant={game.selectedParticipant}
            wordSearch={game.wordSearch}
            foundWords={game.wordsFound}
            onWordFound={game.markWordFound}
            onOpenHint={game.openHint}
            hintAvailable={game.hintAvailable}
          />
          <Hint participant={game.selectedParticipant} onRevealResult={game.revealResult} />
        </section>
      ) : null}

      {game.step === "RESULT" && game.selectedParticipant ? (
        <section className="result-layout">
          <ResultReveal participant={game.selectedParticipant} onRevealFinal={game.revealFinal} />
        </section>
      ) : null}

      {game.step === "FINAL_REVEAL" && game.selectedParticipant ? (
        <FinalReveal participant={game.selectedParticipant} />
      ) : null}
    </main>
  );
}
