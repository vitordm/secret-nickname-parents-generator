interface WelcomeScreenProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function WelcomeScreen({ value, onChange, onSubmit }: WelcomeScreenProps) {
  return (
    <section className="card card--hero" aria-labelledby="welcome-title">
      <h1 id="welcome-title">Descubra seu novo apelido</h1>
      <p>Digite seu nome para começar um pequeno jogo.</p>
      <form
        className="welcome-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label className="field">
          <span>Seu nome</span>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Digite seu nome"
            autoComplete="off"
            aria-label="Seu nome"
          />
        </label>
        <button type="submit">Descobrir meu apelido</button>
      </form>
    </section>
  );
}
