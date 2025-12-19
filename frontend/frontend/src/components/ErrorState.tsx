export default function ErrorState({ message }: { message: string }) {
  return (
    <div style={{ padding: 16, color: "crimson" }}>
      <strong>Fel:</strong> {message}
    </div>
  );
}
