export default function Loading({ text = "Laddar..." }: { text?: string }) {
  return <div style={{ padding: 16 }}>{text}</div>;
}
