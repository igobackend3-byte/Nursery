import { useEffect, useState } from 'react';

// Cycles through `phrases`, typing each one out, pausing, deleting it,
// then moving to the next - looping forever. Returns the current string.
export function useTypewriter(
  phrases,
  { typingSpeed = 70, deletingSpeed = 35, pauseAfterType = 1400, pauseAfterDelete = 300 } = {}
) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    if (phrases.length === 0) return undefined;
    const current = phrases[phraseIndex % phrases.length];
    let timeout;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase('deleting'), pauseAfterType);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), deletingSpeed);
      } else {
        timeout = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % phrases.length);
          setPhase('typing');
        }, pauseAfterDelete);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseAfterType, pauseAfterDelete]);

  return text;
}
