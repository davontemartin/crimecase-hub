import AnimatedCounter from './AnimatedCounter';

export default function StatCard({ icon: Icon, label, value, color = 'red', subtext }) {
  const colors = {
    red: 'bg-red-600/10 text-red-400 border-red-600/20',
    green: 'bg-green-600/10 text-green-400 border-green-600/20',
    blue: 'bg-blue-600/10 text-blue-400 border-blue-600/20',
    yellow: 'bg-yellow-600/10 text-yellow-400 border-yellow-600/20',
    purple: 'bg-purple-600/10 text-purple-400 border-purple-600/20',
  };

  const numValue = typeof value === 'number' ? value : parseInt(value);

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} flex items-center gap-3
                   hover-lift transition-all duration-300 glass-card group`}>
      {Icon && (
        <div className="relative">
          <Icon size={24} className="shrink-0 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 blur-lg opacity-30 group-hover:opacity-60 transition-opacity">
            <Icon size={24} />
          </div>
        </div>
      )}
      <div>
        <div className="text-2xl font-bold animate-count-up">
          {!isNaN(numValue) ? <AnimatedCounter end={numValue} /> : value}
        </div>
        <div className="text-xs opacity-70">{label}</div>
        {subtext && <div className="text-xs opacity-50 mt-0.5">{subtext}</div>}
      </div>
    </div>
  );
}
