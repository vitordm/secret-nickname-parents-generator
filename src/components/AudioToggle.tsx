interface AudioToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

export function AudioToggle({ isOn, onToggle }: AudioToggleProps) {
  return (
    <button type="button" className="audio-toggle" onClick={onToggle} aria-label={isOn ? "Desligar áudio" : "Ligar áudio"}>
      {isOn ? "🔊" : "🔇"}
    </button>
  );
}
