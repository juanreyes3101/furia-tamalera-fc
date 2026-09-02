export function pickRandomNote(notes: string[]): string {
  if (notes.length === 0) return "";
  return notes[Math.floor(Math.random() * notes.length)];
}
