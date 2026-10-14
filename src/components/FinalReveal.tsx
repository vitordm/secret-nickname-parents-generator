import { useEffect, useState } from "react";
import type { Participant } from "../types/participant";

const ultrasoundUrl = new URL("/ultrasound/baby.svg", import.meta.url).href;

interface FinalRevealProps {
  participant: Participant;
}

export function FinalReveal({ participant }: FinalRevealProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 900),
      window.setTimeout(() => setPhase(2), 1700),
      window.setTimeout(() => setPhase(3), 2500)
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <section className="card final-card" aria-labelledby="final-title">
      <h2 id="final-title">Por quê?</h2>
      {phase >= 1 ? <p>Porque nossa família está prestes a aumentar...</p> : null}
      {phase >= 2 ? <p className="final-card__plus-one">+1</p> : null}
      {phase >= 3 ? <p>Estamos esperando um bebê. ❤️</p> : null}
      {participant.showUltrasound ? (
        <figure className="final-card__figure">
          <img src={ultrasoundUrl} alt="Imagem da ultrassonografia" />
          <figcaption>Chegando em breve</figcaption>
        </figure>
      ) : null}
      {phase >= 3 ? <strong className="final-message">{participant.finalMessage}</strong> : null}
    </section>
  );
}
