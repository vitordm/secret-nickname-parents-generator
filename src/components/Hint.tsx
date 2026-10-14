import { useEffect, useState } from "react";
import type { Participant } from "../types/participant";

interface HintProps {
  participant: Participant;
  onRevealResult: () => void;
}

export function Hint({ participant, onRevealResult }: HintProps) {
  const [showRevealButton, setShowRevealButton] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowRevealButton(true);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <aside className="card hint-card" aria-labelledby="hint-title">
      <h2 id="hint-title">Imagem de ajuda</h2>
      <p>Às vezes a pista está bem na sua frente.</p>
      <img
        src={participant.generatedImage}
        alt={`Imagem criada para ${participant.displayName}`}
        className="hint-card__image"
      />
      {showRevealButton ? (
        <button type="button" className="primary-action" onClick={onRevealResult}>
          Exibir meu apelido
        </button>
      ) : (
        <span className="hint-card__caption">Está quase lá...</span>
      )}
    </aside>
  );
}
