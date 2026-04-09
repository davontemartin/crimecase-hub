import { useState, useEffect } from 'react';

export default function TypewriterText({ text, speed = 30, delay = 0, className = '', onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-0.5 h-[1em] bg-red-500 ml-0.5 align-middle"
              style={{ animation: 'blink 0.8s step-end infinite' }} />
      )}
    </span>
  );
}
