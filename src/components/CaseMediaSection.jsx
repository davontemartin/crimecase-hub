import { useState, useEffect } from 'react';
import {
  Film, Video, Mic, Newspaper, BookOpen, ExternalLink,
  Loader2, Sparkles, Play, Radio, RefreshCw
} from 'lucide-react';
import { useAI } from '../hooks/useAI';

export default function CaseMediaSection({ caseData }) {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ai = useAI();

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ai.fetchCaseMedia(caseData);
      setMedia(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchMedia();
  }, [caseData.id]);

  const youtubeSearchUrl = (query) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  const googleSearchUrl = (query) =>
    `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  return (
    <section id="media-section" className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 scroll-mt-20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Film size={18} className="text-green-400" />
          Media & Coverage
          <span className="text-xs px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-normal">
            Live
          </span>
        </h2>
        {media && (
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && !media && (
        <div className="flex flex-col items-center py-10">
          <Loader2 size={28} className="text-green-400 animate-spin mb-3" />
          <p className="text-sm text-zinc-300">Finding videos, articles, and podcasts for {caseData.title}...</p>
          <p className="text-xs text-zinc-500 mt-1">Searching real media sources</p>
        </div>
      )}

      {/* Error State */}
      {error && !media && (
        <div className="text-center py-8">
          <p className="text-sm text-red-400 mb-3">Failed to load media: {error}</p>
          <button
            onClick={fetchMedia}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm text-zinc-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Media Content */}
      {media && (
        <div className="space-y-6">
          {/* YouTube Videos */}
          {media.youtubeVideos?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Play size={12} className="text-red-400" /> YouTube Videos
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {media.youtubeVideos.map((video, i) => (
                  <a
                    key={i}
                    href={youtubeSearchUrl(video.searchQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col bg-zinc-800/50 border border-zinc-700/30 rounded-xl
                             overflow-hidden hover:border-red-900/40 transition-all hover-lift"
                  >
                    {/* Thumbnail area */}
                    <div className="relative aspect-video bg-zinc-800 flex items-center justify-center">
                      <img
                        src={`https://picsum.photos/seed/yt${caseData.id}${i}/400/225?grayscale&blur=2`}
                        alt=""
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center
                                      shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                          <Play size={20} className="text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-white font-mono">
                        YouTube
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">{video.channel}</p>
                      {video.description && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{video.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Documentaries */}
          {media.documentaries?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Video size={12} className="text-purple-400" /> Documentaries & Films
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {media.documentaries.map((doc, i) => (
                  <a
                    key={i}
                    href={googleSearchUrl(`${doc.title} ${doc.year} ${doc.platform} watch`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl
                             hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center shrink-0">
                      <Video size={16} className="text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                        {doc.title}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {doc.year} · {doc.platform}
                      </div>
                      {doc.description && (
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{doc.description}</p>
                      )}
                    </div>
                    <ExternalLink size={12} className="text-zinc-600 shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Podcasts */}
          {media.podcasts?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Radio size={12} className="text-green-400" /> Podcast Episodes
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {media.podcasts.map((pod, i) => (
                  <a
                    key={i}
                    href={googleSearchUrl(`${pod.show} ${pod.episode} podcast`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl
                             hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mic size={16} className="text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
                        {pod.show}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">{pod.episode}</div>
                      {pod.description && (
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{pod.description}</p>
                      )}
                    </div>
                    <ExternalLink size={12} className="text-zinc-600 shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {media.articles?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Newspaper size={12} className="text-blue-400" /> News & Articles
              </h3>
              <div className="space-y-2">
                {media.articles.map((article, i) => (
                  <a
                    key={i}
                    href={googleSearchUrl(`${article.title} ${article.source}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl
                             hover:bg-zinc-800 transition-colors group"
                  >
                    <Newspaper size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {article.source} · {article.year}
                      </div>
                    </div>
                    <ExternalLink size={12} className="text-zinc-600 shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {media.books?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen size={12} className="text-amber-400" /> Books
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {media.books.map((book, i) => (
                  <a
                    key={i}
                    href={googleSearchUrl(`${book.title} ${book.author} book`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl
                             hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">
                        {book.title}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        by {book.author} · {book.year}
                      </div>
                    </div>
                    <ExternalLink size={12} className="text-zinc-600 shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
