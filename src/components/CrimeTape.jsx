export default function CrimeTape({ text = 'CASE FILE', variant = 'default' }) {
  if (variant === 'full') {
    return (
      <div className="relative overflow-hidden py-1 my-4">
        <div className="crime-tape whitespace-nowrap overflow-hidden">
          {Array(10).fill(`  ${text}  ///  `).join('')}
        </div>
      </div>
    );
  }

  return (
    <span className="inline-block px-3 py-0.5 text-[10px] font-black uppercase tracking-[3px]
                   bg-amber-400 text-black rounded-sm transform -rotate-1
                   shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
      {text}
    </span>
  );
}
