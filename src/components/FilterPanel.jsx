import { X, Filter, RotateCcw } from 'lucide-react';
import { crimeTypes, caseStatuses, decades } from '../data/cases';

export default function FilterPanel({ filters, onChange, onReset, isOpen, onToggle }) {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  const activeCount = Object.values(filters).reduce((count, val) => {
    if (Array.isArray(val)) return count + val.length;
    if (val) return count + 1;
    return count;
  }, 0);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl
                 text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
      >
        <Filter size={15} />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 mt-3
                      animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Filter size={16} />
              Filter Cases
            </h3>
            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <RotateCcw size={12} />
                  Clear all
                </button>
              )}
              <button onClick={onToggle} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
              Case Status
            </label>
            <div className="flex flex-wrap gap-2">
              {caseStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => toggleArrayFilter('statuses', status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    (filters.statuses || []).includes(status)
                      ? status === 'Solved' ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                        : status === 'Unsolved' ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                        : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'bg-zinc-800 text-zinc-400 border border-transparent hover:border-zinc-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Crime Type Filter */}
          <div className="mb-5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
              Crime Type
            </label>
            <div className="flex flex-wrap gap-2">
              {crimeTypes.slice(0, 12).map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayFilter('types', type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    (filters.types || []).includes(type)
                      ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                      : 'bg-zinc-800 text-zinc-400 border border-transparent hover:border-zinc-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Decade Filter */}
          <div className="mb-5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
              Era / Decade
            </label>
            <div className="flex flex-wrap gap-2">
              {decades.map(decade => (
                <button
                  key={decade}
                  onClick={() => toggleArrayFilter('decades', decade)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    (filters.decades || []).includes(decade)
                      ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                      : 'bg-zinc-800 text-zinc-400 border border-transparent hover:border-zinc-700'
                  }`}
                >
                  {decade}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
              Sort By
            </label>
            <select
              value={filters.sortBy || 'notoriety'}
              onChange={e => updateFilter('sortBy', e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                       text-sm text-white outline-none focus:border-red-600"
            >
              <option value="notoriety">Notoriety (Most Famous)</option>
              <option value="date-newest">Date (Newest First)</option>
              <option value="date-oldest">Date (Oldest First)</option>
              <option value="title">Alphabetical</option>
              <option value="media">Most Media Coverage</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
}
