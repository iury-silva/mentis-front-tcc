const moodEmojis: Record<
  1 | 2 | 3 | 4 | 5,
  { emoji: string; description: string }
> = {
  5: { emoji: "😄", description: "Muito feliz" },
  4: { emoji: "🙂", description: "Feliz" },
  3: { emoji: "😐", description: "Neutro" },
  2: { emoji: "😔", description: "Triste" },
  1: { emoji: "😢", description: "Muito triste" },
};
export { moodEmojis };
