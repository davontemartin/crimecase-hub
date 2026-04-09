import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search, Menu, X, Home, Database, FileText, Film, Clock,
  Mic, BookOpen, TrendingUp
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/cases', label: 'Case Files', icon: Database },
  { to: '/script-generator', label: 'Script Generator', icon: FileText },
  { to: '/timeline', label: 'Timeline', icon: Clock },
  { to: '/podcast-toolkit', label: 'Podcast Toolkit', icon: Mic },
  { to: '/resources', label: 'Resources', icon: BookOpen },
];

export default function Navbar({ onSearchOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center
                          group-hover:bg-red-500 transition-colors">
              <span className="font-bold text-white text-sm font-[family-name:var(--font-display)]">CC</span>
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
              CrimeCase<span className="text-red-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                >
                  <Icon size={15} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800
                       rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-sm"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search cases...</span>
              <kbd className="hidden sm:inline text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
                /
              </kbd>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-red-600/10 text-red-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
