import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, MapPin, Tag, ChevronRight, Filter, Calendar, ArrowRight } from 'lucide-react';
import { sampleCases } from '../data/cases';

export default function TimelinePage() {
  const [searchParams] = useSearchParams();
  const preselectedCase = searchParams.get('case');

  const [selectedCase, setSelectedCase] = useState(preselectedCase || '');
  const [view, setView] = useState(preselectedCase ? 'case' : 'global');

  const caseData = selectedCase ? sampleCases.find(c => c.id === parseInt(selectedCase)) : null;

  const globalTimeline = useMemo(() => {
    const events = [];
    sampleCases.forEach(c => {
      events.push({
        date: c.date,
        event: `${c.title} — ${c.type} reported`,
        caseId: c.id,
        caseTitle: c.title,
        type: 'start',
        status: c.status,
      });
      if (c.timeline && c.timeline.length > 0) {
        const lastEvent = c.timeline[c.timeline.length - 1];
        if (lastEvent.date !== c.date) {
          events.push({
            date: lastEvent.date,
            event: `${c.title} — ${lastEvent.event}`,
            caseId: c.id,
            caseTitle: c.title,
            type: 'update',
            status: c.status,
          });
        }
      }
    });
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    return events;
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getDecade = (dateStr) => {
    const year = new Date(dateStr).getFullYear();
    return `${Math.floor(year / 10) * 10}s`;
  };

  const groupedEvents = useMemo(() => {
    const events = view === 'case' && caseData
      ? caseData.timeline.map(e => ({ ...e, caseId: caseData.id, caseTitle: caseData.title }))
      : globalTimeline;

    const groups = {};
    events.forEach(event => {
      const decade = getDecade(event.date);
      if (!groups[decade]) groups[decade] = [];
      groups[decade].push(event);
    });
    return groups;
  }, [view, caseData, globalTimeline]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Interactive Timeline
        </h1>
        <p className="text-zinc-400">
          Visualize case events chronologically across the full database
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex items-center gap-1 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-1">
          <button
            onClick={() => { setView('global'); setSelectedCase(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'global'
                ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Global Timeline
          </button>
          <button
            onClick={() => setView('case')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'case'
                ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Case Timeline
          </button>
        </div>

        {view === 'case' && (
          <select
            value={selectedCase}
            onChange={e => setSelectedCase(e.target.value)}
            className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white
                     outline-none focus:border-red-600"
          >
            <option value="">Select a case...</option>
            {sampleCases.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {/* Timeline */}
      {view === 'case' && !selectedCase ? (
        <div className="text-center py-20">
          <Clock size={48} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-xl text-zinc-400 mb-2">Select a Case</p>
          <p className="text-zinc-500">Choose a case from the dropdown to view its detailed timeline</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedEvents).map(([decade, events]) => (
            <div key={decade} className="animate-fade-in">
              {/* Decade Header */}
              <div className="sticky top-16 z-10 mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800
                              rounded-full text-sm font-bold text-white">
                  <Calendar size={14} className="text-red-400" />
                  {decade}
                </div>
              </div>

              {/* Events */}
              <div className="ml-4 sm:ml-8 border-l-2 border-zinc-800 space-y-0">
                {events.map((event, i) => (
                  <div key={i} className="relative pl-6 sm:pl-8 pb-6 group">
                    {/* Dot */}
                    <div className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2
                      ${event.type === 'start' || !event.type
                        ? 'bg-red-600 border-red-400'
                        : 'bg-zinc-600 border-zinc-500'
                      } group-hover:scale-150 transition-transform`}
                    />

                    <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl p-4
                                  hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-mono text-zinc-500 mb-1">
                            {formatDate(event.date)}
                          </div>
                          <p className="text-sm text-zinc-300">{event.event}</p>
                          {view === 'global' && event.caseTitle && (
                            <Link
                              to={`/cases/${event.caseId}`}
                              className="inline-flex items-center gap-1 mt-2 text-xs text-red-400 hover:text-red-300"
                            >
                              {event.caseTitle} <ArrowRight size={10} />
                            </Link>
                          )}
                        </div>
                        {event.status && (
                          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                            event.status === 'Solved' ? 'bg-green-500/10 text-green-400'
                            : event.status === 'Unsolved' ? 'bg-red-500/10 text-red-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {event.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
