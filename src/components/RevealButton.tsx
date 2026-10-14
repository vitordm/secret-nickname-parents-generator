interface RevealButtonProps {
  label: string;
  onClick: () => void;
}

export function RevealButton({ label, onClick }: RevealButtonProps) {
  return (
    <button type="button" className="primary-action" onClick={onClick}>
      {label}
    </button>
  );
}
