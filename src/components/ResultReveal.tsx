import { useEffect, useState } from "react";
import type { Participant } from "../types/participant";

interface ResultRevealProps {
  participant: Participant;
  onRevealFinal: () => void;
}

export function ResultReveal({ participant, onRevealFinal }: ResultRevealProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 700),
      window.setTimeout(() => setPhase(2), 1400)
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <section className="card reveal-card" aria-labelledby="reveal-title">
      <h2 id="reveal-title">{participant.displayName}...</h2>
      {phase >= 1 ? <p>{participant.resultMessage}</p> : <p aria-hidden="true">...</p>}
      {phase >= 2 ? <strong className="nickname">{participant.nickname} ❤️</strong> : null}
      {phase >= 2 ? (
        <button type="button" className="primary-action" onClick={onRevealFinal}>
          Por quê?
        </button>
      ) : null}
    </section>
  );
}
