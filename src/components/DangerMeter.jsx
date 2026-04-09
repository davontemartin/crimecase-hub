import { useEffect, useState, useRef } from 'react';
import { Flame } from 'lucide-react';

const levels = [
  { label: 'Low', color: 'from-green-500 to-green-400', text: 'text-green-400' },
  { label: 'Moderate', color: 'from-yellow-500 to-yellow-400', text: 'text-yellow-400' },
  { label: 'High', color: 'from-orange-500 to-orange-400', text: 'text-orange-400' },
  { label: 'Very High', color: 'from-red-500 to-red-400', text: 'text-red-400' },
  { label: 'Extreme', color: 'from-red-600 to-red-500', text: 'text-red-400' },
];

export default function DangerMeter({ level = 3, showLabel = true }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  const config = levels[Math.min(level, 5) - 1] || levels[0];
  const percentage = (level / 5) * 100;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(percentage), 100);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div ref={ref} className="flex items-center gap-2">
      {showLabel && (
        <span className={`text-xs font-medium ${config.text} flex items-center gap-1`}>
          {level >= 4 && <Flame size={11} className="animate-pulse" />}
          {config.label}
        </span>
      )}
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-3 rounded-sm transition-all duration-300 ${
              i < level
                ? `bg-gradient-to-t ${config.color} ${i < level - 1 ? 'opacity-100' : 'animate-pulse'}`
                : 'bg-zinc-800'
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
