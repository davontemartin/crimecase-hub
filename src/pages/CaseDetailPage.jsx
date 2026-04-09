import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Tag, Shield, Users, FileText,
  Clock, Film, Newspaper, Video, Image, ExternalLink, AlertTriangle,
  ChevronRight, BookOpen, Mic, MessageSquare, Send, Sparkles,
  Loader2, Search, Brain, Target, FlaskConical
} from 'lucide-react';
import { sampleCases } from '../data/cases';
import { useAI } from '../hooks/useAI';

const statusColors = {
  'Solved': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Unsolved': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Cold Case': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Active': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Reopened': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function CaseDetailPage({ aiCases = [] }) {
  const { id } = useParams();
  const caseData = sampleCases.find(c => c.id === parseInt(id))
    || aiCases.find(c => c.id === parseInt(id));
  const ai = useAI();

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [researchResult, setResearchResult] = useState(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [activeResearch, setActiveResearch] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !caseData) return;

    const question = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: question }]);
    setChatLoading(true);

    try {
      const history = chatMessages.map(m => ({ role: m.role, content: m.content }));
      const result = await ai.chatAboutCase(caseData, question, history);
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.answer }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t process that question. Please try again.' }]);
    }
    setChatLoading(false);
  };

  const handleResearch = async (type) => {
    if (!caseData) return;
    setActiveResearch(type);
    setResearchLoading(true);
    setResearchResult(null);

    try {
      const result = await ai.researchCase(caseData, type);
      setResearchResult(result.content);
    } catch {
      setResearchResult('Research failed. Please try again.');
    }
    setResearchLoading(false);
  };

  if (!caseData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Case Not Found</h1>
        <p className="text-zinc-400 mb-6">The case you're looking for doesn't exist in our database.</p>
        <Link to="/cases" className="text-red-400 hover:text-red-300">
          &larr; Back to Case Files
        </Link>
      </div>
    );
  }

  const statusClass = statusColors[caseData.status] || statusColors['Unsolved'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link to="/cases" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-red-400 mb-6 transition-colors">
        <ArrowLeft size={14} />
        Back to Case Files
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className={`text-sm px-3 py-1 rounded-full border font-medium ${statusClass}`}>
            {caseData.status}
          </span>
          <span className="text-sm text-zinc-500 flex items-center gap-1">
            <Tag size={13} /> {caseData.type}
          </span>
          <span className="text-sm text-zinc-500 flex items-center gap-1">
            <MapPin size={13} /> {caseData.location}
          </span>
          <span className="text-sm text-zinc-500 flex items-center gap-1">
            <Calendar size={13} /> {new Date(caseData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {caseData.title}
        </h1>

        <p className="text-lg text-zinc-300">
          <span className="text-zinc-500">Victim(s):</span> {caseData.victim}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <section className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-red-400" />
              Case Summary
            </h2>
            <p className="text-zinc-300 leading-relaxed">{caseData.summary}</p>
          </section>

          {/* Details */}
          <section className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <FileText size={18} className="text-amber-400" />
              Detailed Account
            </h2>
            <p className="text-zinc-300 leading-relaxed">{caseData.details}</p>
          </section>

          {/* Timeline */}
          {caseData.timeline && caseData.timeline.length > 0 && (
            <section className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-purple-400" />
                Timeline of Events
              </h2>
              <div className="space-y-0">
                {caseData.timeline.map((event, i) => (
                  <div key={i} className="flex gap-4 group">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-red-400 shrink-0
                                    group-hover:scale-125 transition-transform" />
                      {i < caseData.timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-zinc-800 min-h-8" />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className="text-xs font-mono text-zinc-500 mb-1">
                        {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <p className="text-sm text-zinc-300">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Evidence */}
          {caseData.evidence && caseData.evidence.length > 0 && (
            <section className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield size={18} className="text-blue-400" />
                Key Evidence
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {caseData.evidence.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl">
                    <span className="text-xs font-bold text-red-400 bg-red-600/10 px-2 py-1 rounded">
                      #{i + 1}
                    </span>
                    <span className="text-sm text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Media & Coverage */}
          <section id="media-section" className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 scroll-mt-20">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Film size={18} className="text-green-400" />
              Media & Coverage
            </h2>

            {/* Documentaries */}
            {caseData.media?.documentaries?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Video size={12} /> Documentaries
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {caseData.media.documentaries.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl
                                          hover:bg-zinc-800 transition-colors group">
                      <div className="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center shrink-0">
                        <Video size={16} className="text-purple-400" />
                      </div>
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Podcasts */}
            {caseData.media?.podcasts?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mic size={12} /> Podcast Coverage
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {caseData.media.podcasts.map((pod, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl
                                          hover:bg-zinc-800 transition-colors group">
                      <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center shrink-0">
                        <Mic size={16} className="text-green-400" />
                      </div>
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{pod}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube */}
            {caseData.media?.youtubeChannels?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Video size={12} /> YouTube Coverage
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseData.media.youtubeChannels.map((ch, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-600/10 border border-red-600/20 rounded-lg
                                           text-sm text-red-300 hover:bg-red-600/20 transition-colors cursor-pointer">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* News Outlets */}
            {caseData.media?.newsOutlets?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Newspaper size={12} /> News Coverage
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseData.media.newsOutlets.map((outlet, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-lg
                                           text-sm text-blue-300 hover:bg-blue-600/20 transition-colors cursor-pointer">
                      {outlet}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Books */}
            {caseData.media?.books?.length > 0 && (
              <div className="mb-2">
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen size={12} /> Books
                </h3>
                <div className="space-y-1.5">
                  {caseData.media.books.map((book, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                      <BookOpen size={13} className="text-amber-400/60 shrink-0" />
                      {book}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback for cases without media field */}
            {!caseData.media && caseData.mediaCount && (
              <div className="text-center py-6">
                <p className="text-sm text-zinc-400 mb-3">
                  {caseData.mediaCount.articles.toLocaleString()} articles, {caseData.mediaCount.videos.toLocaleString()} videos,
                  and {caseData.mediaCount.images.toLocaleString()} images available for this case.
                </p>
                <p className="text-xs text-zinc-500">
                  Search for this case using AI to discover specific documentaries, podcasts, and news coverage.
                </p>
              </div>
            )}
          </section>

          {/* AI Research */}
          <section className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Brain size={18} className="text-amber-400" />
              AI Deep Research
              <span className="text-xs px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 font-normal">
                Powered by Claude
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { id: 'deep-dive', label: 'Full Deep Dive', icon: Search },
                { id: 'suspect-profile', label: 'Suspect Profiles', icon: Target },
                { id: 'evidence-analysis', label: 'Evidence Analysis', icon: FlaskConical },
                { id: 'theories', label: 'Theories & Analysis', icon: Brain },
              ].map(r => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleResearch(r.id)}
                    disabled={researchLoading}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeResearch === r.id
                        ? 'bg-amber-600/10 border border-amber-600/30 text-amber-400'
                        : 'bg-zinc-800 border border-transparent text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <Icon size={14} />
                    {r.label}
                  </button>
                );
              })}
            </div>
            {researchLoading && (
              <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl text-sm text-zinc-300">
                <Loader2 size={16} className="animate-spin text-amber-400" />
                Claude is researching {caseData.title}...
              </div>
            )}
            {researchResult && !researchLoading && (
              <div className="p-4 bg-zinc-800/30 rounded-xl max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed font-[family-name:var(--font-sans)]">
                  {researchResult}
                </pre>
              </div>
            )}
          </section>

          {/* AI Case Chat */}
          <section className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-green-400" />
                Ask About This Case
                <span className="text-xs px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-normal">
                  AI Chat
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Ask Claude anything about {caseData.title}</p>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare size={24} className="mx-auto text-zinc-700 mb-2" />
                  <p className="text-sm text-zinc-500">Ask a question about this case</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {[
                      'What are the main theories?',
                      'Who were the suspects?',
                      'What evidence was found?',
                    ].map(q => (
                      <button
                        key={q}
                        onClick={() => { setChatInput(q); }}
                        className="px-3 py-1 bg-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-red-600/20 text-red-200'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    <pre className="whitespace-pre-wrap font-[family-name:var(--font-sans)]">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 bg-zinc-800 rounded-xl text-sm text-zinc-400 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleChat} className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800/50">
              <input
                type="text"
                placeholder="Ask about this case..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white
                         outline-none focus:border-green-600 placeholder:text-zinc-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="p-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-600
                         text-white rounded-lg transition-all"
              >
                <Send size={16} />
              </button>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to={`/script-generator?case=${caseData.id}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-red-600/10 border border-red-600/20
                         text-red-400 rounded-xl hover:bg-red-600/20 transition-colors text-sm font-medium"
              >
                <FileText size={15} />
                Generate Script
                <ChevronRight size={14} className="ml-auto" />
              </Link>
              <a
                href="#media-section"
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700
                         text-zinc-300 rounded-xl hover:bg-zinc-700 transition-colors text-sm font-medium"
              >
                <Film size={15} />
                View Media
                <ChevronRight size={14} className="ml-auto" />
              </a>
              <Link
                to={`/timeline?case=${caseData.id}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700
                         text-zinc-300 rounded-xl hover:bg-zinc-700 transition-colors text-sm font-medium"
              >
                <Clock size={15} />
                View Timeline
                <ChevronRight size={14} className="ml-auto" />
              </Link>
            </div>
          </div>

          {/* Suspects */}
          {caseData.suspects && caseData.suspects.length > 0 && (
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Users size={15} className="text-amber-400" />
                Suspects / Persons of Interest
              </h3>
              <div className="space-y-2">
                {caseData.suspects.map((suspect, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg">
                    <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center text-xs text-zinc-400">
                      {i + 1}
                    </div>
                    <span className="text-sm text-zinc-300">{suspect}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Tag size={15} className="text-cyan-400" />
              Tags & Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {caseData.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-lg text-xs text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Media Stats */}
          {caseData.mediaCount && (
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Film size={15} className="text-green-400" />
                Available Media
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 rounded-lg">
                  <span className="flex items-center gap-2 text-sm text-zinc-400">
                    <Newspaper size={14} /> Articles
                  </span>
                  <span className="text-sm font-semibold text-white">{caseData.mediaCount.articles.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 rounded-lg">
                  <span className="flex items-center gap-2 text-sm text-zinc-400">
                    <Video size={14} /> Videos
                  </span>
                  <span className="text-sm font-semibold text-white">{caseData.mediaCount.videos.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 rounded-lg">
                  <span className="flex items-center gap-2 text-sm text-zinc-400">
                    <Image size={14} /> Images
                  </span>
                  <span className="text-sm font-semibold text-white">{caseData.mediaCount.images.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
