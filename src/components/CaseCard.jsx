import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ChevronRight, Newspaper, Video, Image, Flame, Eye } from 'lucide-react';
import DangerMeter from './DangerMeter';

const statusColors = {
  'Solved': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Unsolved': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Cold Case': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Active': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Reopened': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const statusDots = {
  'Solved': 'bg-green-500 shadow-green-500/50',
  'Unsolved': 'bg-red-500 shadow-red-500/50',
  'Cold Case': 'bg-blue-500 shadow-blue-500/50',
  'Active': 'bg-yellow-500 shadow-yellow-500/50 animate-pulse',
  'Reopened': 'bg-purple-500 shadow-purple-500/50',
};

const typeIcons = {
  'Murder': '🔪', 'Serial Killer': '💀', 'Kidnapping': '🔗',
  'Missing Person': '❓', 'Heist': '💰', 'Terrorism': '💣',
  'Wrongful Conviction': '⚖️', 'Robbery': '🏴', 'Fraud': '📄',
  'Cult Crime': '🕯️', 'Arson': '🔥', 'Cold Case': '🧊',
};

export default function CaseCard({ caseData, variant = 'default' }) {
  const statusClass = statusColors[caseData.status] || statusColors['Unsolved'];
  const dotClass = statusDots[caseData.status] || statusDots['Unsolved'];

  if (variant === 'compact') {
    return (
      <Link
        to={`/cases/${caseData.id}`}
        className="flex items-center gap-4 p-4 glass-card rounded-xl
                 hover-lift cursor-case group"
      >
        <div className="text-2xl">{typeIcons[caseData.type] || '📋'}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors truncate">
            {caseData.title}
          </h3>
          <p className="text-sm text-zinc-400 mt-0.5">{caseData.victim}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusClass}`}>
          {caseData.status}
        </span>
        <ChevronRight size={16} className="text-zinc-600 group-hover:text-red-400 transition-all
                                         group-hover:translate-x-1" />
      </Link>
    );
  }

  return (
    <Link
      to={`/cases/${caseData.id}`}
      className="group block glass-card rounded-2xl overflow-hidden
               hover-lift cursor-case relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-transparent to-transparent
                    opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-2xl" />

      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-transparent
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div className="p-5 relative">
        {/* Type & Status Row */}
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">
            <span className="text-base">{typeIcons[caseData.type] || '📋'}</span>
            {caseData.type}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px] ${dotClass}`} />
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusClass}`}>
              {caseData.status}
            </span>
          </div>
        </div>

        {/* Title with glitch on hover for unsolved */}
        <h3 className={`text-lg font-bold text-white group-hover:text-red-400 transition-colors mb-1
                      ${caseData.status === 'Unsolved' ? 'glitch' : ''}`}
            data-text={caseData.title}>
          {caseData.title}
        </h3>

        {/* Victim */}
        <p className="text-sm text-zinc-300 mb-2 flex items-center gap-1.5">
          <Eye size={12} className="text-zinc-500" />
          {caseData.victim}
        </p>

        {/* Summary */}
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
          {caseData.summary}
        </p>

        {/* Notoriety / Danger Meter */}
        {caseData.notoriety && (
          <div className="mb-4">
            <DangerMeter level={caseData.notoriety} />
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mb-3">
          <span className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
            <MapPin size={12} className="text-red-500/50" />
            {caseData.location}
          </span>
          <span className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
            <Calendar size={12} className="text-red-500/50" />
            {new Date(caseData.date).getFullYear()}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {caseData.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-zinc-800/80 rounded-md text-xs text-zinc-400
                                     group-hover:bg-zinc-700/80 group-hover:text-zinc-300 transition-all">
              {tag}
            </span>
          ))}
          {caseData.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-zinc-600">+{caseData.tags.length - 3}</span>
          )}
        </div>

        {/* Media Counts - bottom bar */}
        {caseData.mediaCount && (
          <div className="flex items-center gap-4 pt-3 border-t border-zinc-800/50 text-xs text-zinc-500">
            <span className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
              <Newspaper size={11} className="text-blue-400/50" />
              {caseData.mediaCount.articles.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
              <Video size={11} className="text-purple-400/50" />
              {caseData.mediaCount.videos.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
              <Image size={11} className="text-green-400/50" />
              {caseData.mediaCount.images.toLocaleString()}
            </span>
            <span className="ml-auto text-red-400/0 group-hover:text-red-400 transition-all flex items-center gap-1
                           translate-x-2 group-hover:translate-x-0">
              Open Case <ChevronRight size={12} />
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
