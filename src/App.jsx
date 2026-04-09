import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchModal from './components/SearchModal';
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
// Media is now embedded directly on case profiles
import TimelinePage from './pages/TimelinePage';
import PodcastToolkitPage from './pages/PodcastToolkitPage';
import ResourcesPage from './pages/ResourcesPage';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiCases, setAiCases] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && !searchOpen && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  const handleAddCases = useCallback((newCases) => {
    setAiCases(prev => {
      const existing = new Set(prev.map(c => c.id));
      const unique = newCases.filter(c => !existing.has(c.id));
      return [...prev, ...unique];
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onAddCases={handleAddCases}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage onSearchOpen={() => setSearchOpen(true)} />} />
          <Route path="/cases" element={<CasesPage aiCases={aiCases} />} />
          <Route path="/cases/:id" element={<CaseDetailPage aiCases={aiCases} />} />
          <Route path="/script-generator" element={<ScriptGeneratorPage aiCases={aiCases} />} />
          {/* Media is now embedded on case profiles */}
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/podcast-toolkit" element={<PodcastToolkitPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">CC</span>
              </div>
              <span className="text-sm text-zinc-400">
                CrimeCase<span className="text-red-500">Hub</span> — True Crime Research Platform
              </span>
            </div>
            <p className="text-xs text-zinc-600 text-center">
              This platform is for educational and research purposes. Always approach true crime content
              with respect for victims and their families.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
