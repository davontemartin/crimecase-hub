import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Film, Newspaper, Video, Image, ExternalLink, Search, Filter,
  Play, Clock, Eye, ThumbsUp, Calendar, Globe, ArrowRight
} from 'lucide-react';
import { sampleCases } from '../data/cases';

const mockMedia = {
  videos: [
    { id: 1, title: "The Unsolved Mystery of the Black Dahlia", channel: "Buzzfeed Unsolved", views: "12M", duration: "24:15", caseId: 1, type: "youtube" },
    { id: 2, title: "Zodiac Killer: The Full Story", channel: "JCS Criminal Psychology", views: "8.2M", duration: "45:30", caseId: 2, type: "youtube" },
    { id: 3, title: "Who Killed JonBenet?", channel: "60 Minutes", views: "5.6M", duration: "15:22", caseId: 3, type: "news" },
    { id: 4, title: "DB Cooper: The Impossible Heist", channel: "LEMMiNO", views: "15M", duration: "32:10", caseId: 4, type: "youtube" },
    { id: 5, title: "Ted Bundy: Mind of a Monster", channel: "Investigation Discovery", views: "3.1M", duration: "42:00", caseId: 5, type: "documentary" },
    { id: 6, title: "The Real Jack the Ripper", channel: "BBC Documentary", views: "7.8M", duration: "58:45", caseId: 6, type: "documentary" },
    { id: 7, title: "Madeleine McCann: The Full Investigation", channel: "Netflix", views: "20M", duration: "52:30", caseId: 7, type: "documentary" },
    { id: 8, title: "Golden State Killer: How DNA Caught Him", channel: "True Crime Daily", views: "4.5M", duration: "18:22", caseId: 9, type: "news" },
    { id: 9, title: "The Gardner Museum Heist Explained", channel: "Vox", views: "9.1M", duration: "12:48", caseId: 15, type: "youtube" },
    { id: 10, title: "Jeffrey Dahmer: A Timeline of Terror", channel: "Crime Scene Analysis", views: "6.3M", duration: "35:15", caseId: 16, type: "youtube" },
  ],
  articles: [
    { id: 1, title: "New DNA Evidence Could Solve the Black Dahlia Case", source: "LA Times", date: "2024-03-15", caseId: 1 },
    { id: 2, title: "Zodiac Killer Cipher Finally Decoded After 50 Years", source: "San Francisco Chronicle", date: "2023-12-10", caseId: 2 },
    { id: 3, title: "JonBenet Ramsey Case: Boulder Police Announce DNA Testing", source: "CBS News", date: "2024-01-22", caseId: 3 },
    { id: 4, title: "DB Cooper: New Analysis of Parachute Evidence", source: "FBI.gov", date: "2023-11-24", caseId: 4 },
    { id: 5, title: "Ted Bundy's Last Interview: What He Revealed", source: "The Guardian", date: "2024-02-14", caseId: 5 },
    { id: 6, title: "Jack the Ripper Identity Confirmed by DNA? Scientists Weigh In", source: "BBC News", date: "2024-04-01", caseId: 6 },
    { id: 7, title: "Madeleine McCann: Brueckner Trial Update", source: "Reuters", date: "2024-05-10", caseId: 7 },
    { id: 8, title: "How Genetic Genealogy is Solving Cold Cases", source: "The Atlantic", date: "2024-01-05", caseId: 9 },
    { id: 9, title: "The Gardner Museum Increases Reward to $10M", source: "Boston Globe", date: "2023-09-18", caseId: 15 },
    { id: 10, title: "Tupac Murder: Keffe D Trial Date Set", source: "Rolling Stone", date: "2024-06-01", caseId: 14 },
    { id: 11, title: "The Tylenol Murders: 40 Years Later", source: "Chicago Tribune", date: "2023-09-29", caseId: 19 },
    { id: 12, title: "West Memphis Three: The Fight Continues", source: "Arkansas Democrat-Gazette", date: "2024-03-20", caseId: 18 },
  ],
  images: [
    { id: 1, title: "Black Dahlia Crime Scene (Redacted)", type: "Evidence", caseId: 1 },
    { id: 2, title: "Zodiac Killer Cipher Letters", type: "Evidence", caseId: 2 },
    { id: 3, title: "JonBenet Ramsey Ransom Note", type: "Evidence", caseId: 3 },
    { id: 4, title: "DB Cooper FBI Sketch", type: "Composite", caseId: 4 },
    { id: 5, title: "Ted Bundy Mugshot Collection", type: "Mugshot", caseId: 5 },
    { id: 6, title: "Whitechapel Map 1888", type: "Map", caseId: 6 },
    { id: 7, title: "Alcatraz Escape Dummy Heads", type: "Evidence", caseId: 10 },
    { id: 8, title: "Golden State Killer Crime Map", type: "Map", caseId: 9 },
  ]
};

const mediaTypeColors = {
  youtube: 'bg-red-600/10 text-red-400',
  documentary: 'bg-purple-600/10 text-purple-400',
  news: 'bg-blue-600/10 text-blue-400',
};

export default function MediaHubPage() {
  const [searchParams] = useSearchParams();
  const preselectedCase = searchParams.get('case');

  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState(preselectedCase || '');
  const [activeTab, setActiveTab] = useState('videos');

  const filteredMedia = useMemo(() => {
    let items = mockMedia[activeTab] || [];

    if (selectedCase) {
      items = items.filter(m => m.caseId === parseInt(selectedCase));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(m =>
        m.title.toLowerCase().includes(q) ||
        (m.channel && m.channel.toLowerCase().includes(q)) ||
        (m.source && m.source.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeTab, selectedCase, search]);

  const caseData = selectedCase ? sampleCases.find(c => c.id === parseInt(selectedCase)) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Media Hub
        </h1>
        <p className="text-zinc-400">
          Find videos, articles, news clips, and images related to any case
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl
                     text-white text-sm outline-none focus:border-red-600/50 placeholder:text-zinc-500"
          />
        </div>
        <select
          value={selectedCase}
          onChange={e => setSelectedCase(e.target.value)}
          className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white
                   outline-none focus:border-red-600"
        >
          <option value="">All Cases</option>
          {sampleCases.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Selected Case Info */}
      {caseData && (
        <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-white">{caseData.title}</h3>
            <p className="text-sm text-zinc-400 mt-0.5">{caseData.type} — {caseData.location}</p>
          </div>
          <Link to={`/cases/${caseData.id}`} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
            View Case <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-1
                    w-fit">
        {[
          { id: 'videos', label: 'Videos', icon: Video, count: mockMedia.videos.length },
          { id: 'articles', label: 'Articles', icon: Newspaper, count: mockMedia.articles.length },
          { id: 'images', label: 'Images', icon: Image, count: mockMedia.images.length },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon size={15} />
              {tab.label}
              <span className="text-xs opacity-60">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-20">
          <Film size={48} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-xl text-zinc-400 mb-2">No media found</p>
          <p className="text-zinc-500">Try adjusting your search or filters</p>
        </div>
      ) : activeTab === 'videos' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedia.map(video => {
            const relatedCase = sampleCases.find(c => c.id === video.caseId);
            return (
              <div key={video.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden
                                           hover:border-zinc-700/50 transition-all group">
                {/* Thumbnail Placeholder */}
                <div className="relative aspect-video bg-zinc-800 flex items-center justify-center">
                  <Play size={40} className="text-zinc-600 group-hover:text-red-400 transition-colors" />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-xs text-white font-mono">
                    {video.duration}
                  </span>
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium ${mediaTypeColors[video.type]}`}>
                    {video.type}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-2">{video.channel}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Eye size={11} />{video.views} views</span>
                    {relatedCase && (
                      <Link to={`/cases/${relatedCase.id}`} className="text-red-400 hover:text-red-300">
                        {relatedCase.title}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : activeTab === 'articles' ? (
        <div className="space-y-3">
          {filteredMedia.map(article => {
            const relatedCase = sampleCases.find(c => c.id === article.caseId);
            return (
              <div key={article.id} className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-zinc-800/50
                                             rounded-xl hover:border-zinc-700/50 transition-all group">
                <Newspaper size={20} className="text-blue-400 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Globe size={11} />{article.source}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{article.date}</span>
                    {relatedCase && (
                      <Link to={`/cases/${relatedCase.id}`} className="text-red-400 hover:text-red-300">
                        {relatedCase.title}
                      </Link>
                    )}
                  </div>
                </div>
                <ExternalLink size={14} className="text-zinc-600 shrink-0 mt-1" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map(img => {
            const relatedCase = sampleCases.find(c => c.id === img.caseId);
            return (
              <div key={img.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden
                                         hover:border-zinc-700/50 transition-all group">
                <div className="aspect-square bg-zinc-800 flex items-center justify-center">
                  <Image size={32} className="text-zinc-600" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-white truncate">{img.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{img.type}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
