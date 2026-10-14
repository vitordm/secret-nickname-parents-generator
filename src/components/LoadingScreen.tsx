interface LoadingScreenProps {
  progress: number;
  message: string;
}

export function LoadingScreen({ progress, message }: LoadingScreenProps) {
  return (
    <section className="card card--loading" aria-labelledby="loading-title">
      <h2 id="loading-title">Criando seu novo apelido...</h2>
      <p>{message || "Consultando nossos registros secretos..."}</p>
      <div className="progress" aria-label={`Progresso ${progress}%`}>
        <div className="progress__bar" style={{ width: `${progress}%` }} />
      </div>
      <strong>{progress}%</strong>
    </section>
  );
}
