import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ArrowRight, Database, FileText, Film, Clock, Mic,
  BookOpen, Shield, Skull, HelpCircle, Scale, TrendingUp,
  Newspaper, Video, AlertTriangle, ChevronRight, Sparkles,
  Fingerprint, ScanLine, Radio
} from 'lucide-react';
import { sampleCases } from '../data/cases';
import CaseCard from '../components/CaseCard';
import StatCard from '../components/StatCard';
import ParticleField from '../components/ParticleField';
import TypewriterText from '../components/TypewriterText';
import CrimeTape from '../components/CrimeTape';

export default function HomePage({ onSearchOpen }) {
  const unsolvedCount = sampleCases.filter(c => c.status === 'Unsolved').length;
  const solvedCount = sampleCases.filter(c => c.status === 'Solved').length;
  const featuredCases = sampleCases.filter(c => c.notoriety === 5).slice(0, 6);
  const recentUnsolved = sampleCases.filter(c => c.status === 'Unsolved').slice(0, 3);

  const features = [
    { icon: Database, title: 'Case Database', desc: 'Search and filter 20+ detailed cases by type, status, date, and location', to: '/cases', color: 'text-red-400' },
    { icon: FileText, title: 'Script Generator', desc: 'Auto-generate podcast and video scripts with customizable templates', to: '/script-generator', color: 'text-amber-400' },
    { icon: Film, title: 'Case Media', desc: 'Every case includes documentaries, podcasts, news, and YouTube coverage', to: '/cases', color: 'text-blue-400' },
    { icon: Clock, title: 'Interactive Timeline', desc: 'Visualize case events chronologically with an evidence board', to: '/timeline', color: 'text-purple-400' },
    { icon: Mic, title: 'Podcast Toolkit', desc: 'Episode planning, show notes, and export tools for creators', to: '/podcast-toolkit', color: 'text-green-400' },
    { icon: BookOpen, title: 'Resources Hub', desc: 'Curated links, legal databases, and research references', to: '/resources', color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden noise-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-zinc-950 to-zinc-950" />
        <ParticleField count={40} color="#dc2626" />

        {/* Scanline effect */}
        <div className="absolute inset-0 scanline pointer-events-none" />

        {/* Crosshair decorations */}
        <div className="absolute top-20 right-10 sm:right-20 opacity-10">
          <Fingerprint size={120} className="text-red-500" strokeWidth={0.5} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-red" />
              <span className="text-xs font-medium text-red-400 uppercase tracking-widest">
                True Crime Research Platform
              </span>
              <CrimeTape text="CLASSIFIED" />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 animate-fade-in-up"
                style={{ fontFamily: 'var(--font-display)', animationDelay: '0.1s', opacity: 0 }}>
              Every Case.<br />
              <span className="text-red-500 relative">
                Every Detail.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-red-600/30" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeDasharray="200" strokeDashoffset="200"
                        style={{ animation: 'dashOffset 1.5s ease-out 0.8s forwards' }} />
                </svg>
              </span><br />
              One Hub.
            </h1>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed mb-3 max-w-2xl">
                The ultimate research platform for true crime enthusiasts, podcasters, and content creators.
              </p>
              <p className="text-sm text-zinc-500 mb-8 max-w-2xl font-mono flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                <TypewriterText
                  text="Powered by AI — search any case, generate scripts, deep research on demand."
                  speed={25}
                  delay={1000}
                />
              </p>
            </div>

            <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <button
                onClick={onSearchOpen}
                className="group flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white
                         font-semibold rounded-xl transition-all shadow-lg shadow-red-600/25
                         hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search size={18} className="group-hover:rotate-12 transition-transform" />
                Search Cases
                <kbd className="ml-1 px-1.5 py-0.5 bg-red-700/50 rounded text-xs text-red-200">/</kbd>
              </button>
              <Link
                to="/cases"
                className="group flex items-center gap-2 px-6 py-3.5 bg-zinc-800/80 hover:bg-zinc-700 text-white
                         font-semibold rounded-xl transition-all border border-zinc-700
                         hover:border-zinc-600 hover:scale-[1.02] active:scale-[0.98]"
              >
                Browse Database
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/script-generator"
                className="group flex items-center gap-2 px-6 py-3.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400
                         font-semibold rounded-xl transition-all border border-amber-600/20
                         hover:border-amber-600/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                AI Script Writer
              </Link>
            </div>

            {/* Scrolling case marquee */}
            <div className="mt-12 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Trending Cases</p>
              <div className="flex gap-3 animate-marquee">
                {sampleCases.slice(0, 10).map(c => (
                  <Link
                    key={c.id}
                    to={`/cases/${c.id}`}
                    className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50
                             rounded-lg text-xs text-zinc-400 hover:text-red-400 hover:border-red-900/30 transition-all"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      c.status === 'Unsolved' ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CrimeTape text="DO NOT CROSS — CRIME SCENE — DO NOT CROSS" variant="full" />

      {/* Stats Bar */}
      <section className="border-y border-zinc-800/50 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={Database} label="Total Cases" value={sampleCases.length} color="red" />
            <StatCard icon={Shield} label="Solved" value={solvedCount} color="green" />
            <StatCard icon={AlertTriangle} label="Unsolved" value={unsolvedCount} color="red" />
            <StatCard icon={TrendingUp} label="Active Investigations" value={sampleCases.filter(c => c.status === 'Active').length} color="yellow" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Your Complete True Crime Toolkit
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Everything you need to research, create, and share true crime content
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="group p-6 glass-card rounded-2xl hover-lift relative overflow-hidden"
              >
                {/* Background glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0
                              group-hover:opacity-10 transition-opacity duration-500 ${f.color.replace('text-', 'bg-')}`} />

                <div className="relative">
                  <div className="relative inline-block mb-4">
                    <Icon size={28} className={`${f.color} group-hover:scale-110 transition-transform`} />
                    <div className={`absolute inset-0 blur-lg opacity-0 group-hover:opacity-40 transition-opacity`}>
                      <Icon size={28} className={f.color} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{f.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-sm text-zinc-500 group-hover:text-red-400
                              transition-all group-hover:translate-x-1">
                    Explore <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Most Notorious Cases
            </h2>
            <p className="text-zinc-400 mt-1">High-profile cases that captivated the world</p>
          </div>
          <Link
            to="/cases"
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {featuredCases.map(c => (
            <CaseCard key={c.id} caseData={c} />
          ))}
        </div>
      </section>

      {/* Unsolved Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-red-950/30 to-zinc-900/50 border border-red-900/20
                      rounded-2xl p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-red" />
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Unsolved Case Spotlight
            </h2>
          </div>
          <p className="text-zinc-400 mb-6">
            These cases remain unsolved. Help bring attention to them by creating content.
          </p>
          <div className="space-y-3">
            {recentUnsolved.map(c => (
              <CaseCard key={c.id} caseData={c} variant="compact" />
            ))}
          </div>
          <Link
            to="/cases?status=Unsolved"
            className="inline-flex items-center gap-2 mt-6 text-red-400 hover:text-red-300 text-sm font-medium"
          >
            View all unsolved cases <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-20">
        <div className="text-center bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-10 sm:p-16">
          <Mic size={40} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Create?
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-6">
            Pick a case, generate a script, and start producing your true crime content today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/script-generator"
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all"
            >
              Generate a Script
            </Link>
            <Link
              to="/podcast-toolkit"
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl
                       transition-all border border-zinc-700"
            >
              Podcast Toolkit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
