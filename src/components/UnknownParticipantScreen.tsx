interface UnknownParticipantScreenProps {
  onRetry: () => void;
}

export function UnknownParticipantScreen({ onRetry }: UnknownParticipantScreenProps) {
  return (
    <section className="card card--hero" aria-labelledby="unknown-title">
      <h2 id="unknown-title">Hmm...</h2>
      <p>Não encontramos nenhum apelido preparado para esse nome.</p>
      <p>Confira se digitou corretamente e tente novamente.</p>
      <button type="button" onClick={onRetry}>
        Tentar novamente
      </button>
    </section>
  );
}
