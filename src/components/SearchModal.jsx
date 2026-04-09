import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Clock, Tag, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { sampleCases } from '../data/cases';
import { useAI } from '../hooks/useAI';

export default function SearchModal({ isOpen, onClose, onAddCases }) {
  const [query, setQuery] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [aiResults, setAiResults] = useState([]);
  const [aiSearching, setAiSearching] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const ai = useAI();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setLocalResults([]);
      setAiResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setLocalResults([]);
      setAiResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = sampleCases.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.victim.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q)) ||
      c.summary.toLowerCase().includes(q)
    );
    setLocalResults(filtered);
  }, [query]);

  const handleAISearch = async () => {
    if (!query.trim()) return;
    setAiSearching(true);
    try {
      const result = await ai.searchCases(query);
      if (result.cases && result.cases.length > 0) {
        setAiResults(result.cases);
        if (onAddCases) onAddCases(result.cases);
      }
    } catch {
      // silently fail
    }
    setAiSearching(false);
  };

  if (!isOpen) return null;

  const goToCase = (caseData) => {
    if (caseData.id >= 1000 && onAddCases) {
      onAddCases([caseData]);
    }
    navigate(`/cases/${caseData.id}`);
    onClose();
  };

  const allResults = [...localResults, ...aiResults.filter(ai => !localResults.find(l => l.id === ai.id))];

  const renderCaseResult = (c, source) => (
    <button
      key={`${source}-${c.id}`}
      onClick={() => goToCase(c)}
      className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-zinc-800/50
               transition-colors border-b border-zinc-800/50 group"
    >
      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
        c.status === 'Solved' ? 'bg-green-500' :
        c.status === 'Unsolved' ? 'bg-red-500' :
        c.status === 'Active' ? 'bg-yellow-500' :
        'bg-blue-500'
      }`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white group-hover:text-red-400 transition-colors">
            {c.title}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            c.status === 'Solved' ? 'bg-green-500/10 text-green-400' :
            c.status === 'Unsolved' ? 'bg-red-500/10 text-red-400' :
            'bg-yellow-500/10 text-yellow-400'
          }`}>
            {c.status}
          </span>
          {source === 'ai' && (
            <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 bg-amber-500/10 rounded-full text-amber-400">
              <Sparkles size={9} /> AI
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
          <span className="flex items-center gap-1"><Tag size={12} />{c.type}</span>
          <span className="flex items-center gap-1"><MapPin size={12} />{c.location}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{c.date?.slice(0, 4)}</span>
        </div>
      </div>
      <ArrowRight size={16} className="text-zinc-600 group-hover:text-red-400 mt-2 transition-colors" />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl
                    animate-fade-in overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <Search size={20} className="text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search cases, victims, locations, crime types..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && localResults.length === 0) handleAISearch(); }}
            className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-zinc-500"
          />
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Local Results */}
          {localResults.length > 0 && (
            <>
              <div className="px-5 pt-3 pb-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Database Results ({localResults.length})
                </p>
              </div>
              {localResults.map(c => renderCaseResult(c, 'local'))}
            </>
          )}

          {/* AI Results */}
          {aiResults.length > 0 && (
            <>
              <div className="px-5 pt-3 pb-1">
                <p className="text-xs font-medium text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={11} /> AI-Discovered Cases ({aiResults.length})
                </p>
              </div>
              {aiResults.map(c => renderCaseResult(c, 'ai'))}
            </>
          )}

          {/* No results + AI search option */}
          {query && localResults.length === 0 && aiResults.length === 0 && !aiSearching && (
            <div className="px-5 py-8 text-center">
              <Search size={32} className="mx-auto mb-3 text-zinc-600" />
              <p className="text-zinc-400 mb-1">No local cases found for "{query}"</p>
              <p className="text-sm text-zinc-500 mb-4">Want Claude to search for real cases?</p>
              <button
                onClick={handleAISearch}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500
                         text-white font-medium rounded-xl transition-all text-sm"
              >
                <Sparkles size={15} />
                Search with AI
              </button>
            </div>
          )}

          {/* Also offer AI search when local results exist */}
          {query && localResults.length > 0 && aiResults.length === 0 && !aiSearching && (
            <div className="px-5 py-3 border-t border-zinc-800/50">
              <button
                onClick={handleAISearch}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                         bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white
                         font-medium rounded-xl transition-all text-sm"
              >
                <Sparkles size={14} className="text-amber-400" />
                Find more cases with AI
              </button>
            </div>
          )}

          {/* AI Loading */}
          {aiSearching && (
            <div className="px-5 py-8 text-center">
              <Loader2 size={28} className="mx-auto mb-3 text-amber-400 animate-spin" />
              <p className="text-zinc-300">Claude is searching for cases...</p>
              <p className="text-xs text-zinc-500 mt-1">Finding real criminal cases matching "{query}"</p>
            </div>
          )}

          {/* Quick Filters */}
          {!query && (
            <div className="px-5 py-6">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Quick Filters</p>
              <div className="flex flex-wrap gap-2">
                {['Unsolved', 'Serial Killer', 'Missing Person', 'Cold Case', 'Heist', 'Murder'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm
                             text-zinc-300 hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 mt-5">
                Or search for any case
              </p>
              <div className="flex flex-wrap gap-2">
                {['Dahmer', 'Menendez Brothers', 'OJ Simpson', 'Amelia Earhart', 'Natalie Holloway'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => { setQuery(tag); }}
                    className="px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-600/20
                             rounded-lg text-sm text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    <span className="flex items-center gap-1"><Sparkles size={10} />{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-zinc-800 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">↵</kbd> AI Search
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">esc</kbd> Close
          </span>
          <span className="ml-auto flex items-center gap-1 text-amber-400">
            <Sparkles size={10} /> Powered by Claude AI
          </span>
        </div>
      </div>
    </div>
  );
}
