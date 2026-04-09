import { useState, useMemo } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { sampleCases } from '../data/cases';
import CaseCard from '../components/CaseCard';
import FilterPanel from '../components/FilterPanel';

const defaultFilters = {
  statuses: [],
  types: [],
  decades: [],
  sortBy: 'notoriety',
};

export default function CasesPage({ aiCases = [] }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState('grid');

  const allCases = useMemo(() => {
    const existing = new Set(sampleCases.map(c => c.id));
    return [...sampleCases, ...aiCases.filter(c => !existing.has(c.id))];
  }, [aiCases]);

  const filteredCases = useMemo(() => {
    let cases = [...allCases];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      cases = cases.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.victim.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filters.statuses.length > 0) {
      cases = cases.filter(c => filters.statuses.includes(c.status));
    }

    // Type filter
    if (filters.types.length > 0) {
      cases = cases.filter(c => filters.types.includes(c.type));
    }

    // Decade filter
    if (filters.decades.length > 0) {
      cases = cases.filter(c => {
        const year = new Date(c.date).getFullYear();
        const decade = `${Math.floor(year / 10) * 10}s`;
        return filters.decades.includes(decade);
      });
    }

    // Sort
    switch (filters.sortBy) {
      case 'date-newest':
        cases.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'date-oldest':
        cases.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'title':
        cases.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'media':
        cases.sort((a, b) => (b.mediaCount?.articles || 0) - (a.mediaCount?.articles || 0));
        break;
      default:
        cases.sort((a, b) => (b.notoriety || 0) - (a.notoriety || 0));
    }

    return cases;
  }, [search, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Case Files
        </h1>
        <p className="text-zinc-400">
          Browse, search, and filter {allCases.length} documented criminal cases
        </p>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, victim, location, type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl
                     text-white text-sm outline-none focus:border-red-600/50 transition-colors
                     placeholder:text-zinc-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2.5 transition-colors ${view === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 text-sm text-zinc-400">
        <span>Showing {filteredCases.length} of {allCases.length} cases</span>
      </div>

      {/* Cases Grid/List */}
      {filteredCases.length === 0 ? (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-xl text-zinc-400 mb-2">No cases found</p>
          <p className="text-zinc-500">Try adjusting your search or filters</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map(c => (
            <CaseCard key={c.id} caseData={c} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.map(c => (
            <CaseCard key={c.id} caseData={c} variant="compact" />
          ))}
        </div>
      )}
    </div>
  );
}
