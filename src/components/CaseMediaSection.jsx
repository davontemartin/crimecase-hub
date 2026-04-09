import { useState, useEffect } from 'react';
import {
  Film, Video, Mic, Newspaper, BookOpen, ExternalLink,
  Loader2, Sparkles, Play, Radio, RefreshCw, Image,
  Camera, AlertTriangle, Eye, EyeOff, MapPin, FileText
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

          {/* Case Images */}
          {media.images?.length > 0 && (
            <CaseImageGallery images={media.images} caseTitle={caseData.title} />
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

const imageTypeIcons = {
  'Crime Scene': { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-600/10' },
  'Evidence': { icon: FileText, color: 'text-amber-400', bg: 'bg-amber-600/10' },
  'Mugshot': { icon: Camera, color: 'text-orange-400', bg: 'bg-orange-600/10' },
  'Victim Photo': { icon: Eye, color: 'text-blue-400', bg: 'bg-blue-600/10' },
  'Location': { icon: MapPin, color: 'text-green-400', bg: 'bg-green-600/10' },
  'Court': { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-600/10' },
  'Document': { icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-600/10' },
  'Composite Sketch': { icon: Camera, color: 'text-zinc-400', bg: 'bg-zinc-600/10' },
  'Map': { icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
  'Memorial': { icon: Eye, color: 'text-pink-400', bg: 'bg-pink-600/10' },
};

function CaseImageGallery({ images, caseTitle }) {
  const [revealedSensitive, setRevealedSensitive] = useState({});

  const googleImagesUrl = (query) =>
    `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

  const toggleSensitive = (i) => {
    setRevealedSensitive(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Camera size={12} className="text-cyan-400" /> Case Images & Evidence Photos
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img, i) => {
          const typeConfig = imageTypeIcons[img.type] || imageTypeIcons['Evidence'];
          const Icon = typeConfig.icon;
          const isSensitive = img.sensitive && !revealedSensitive[i];

          return (
            <div key={i} className="group relative">
              {/* Image Card */}
              <a
                href={isSensitive ? undefined : googleImagesUrl(img.searchQuery)}
                target={isSensitive ? undefined : '_blank'}
                rel="noopener noreferrer"
                onClick={isSensitive ? (e) => { e.preventDefault(); toggleSensitive(i); } : undefined}
                className="block bg-zinc-800/50 border border-zinc-700/30 rounded-xl overflow-hidden
                         hover:border-zinc-600/50 transition-all"
              >
                {/* Image placeholder with themed gradient */}
                <div className="relative aspect-[4/3] bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/img${caseTitle.length}${i}/300/225?grayscale&blur=${isSensitive ? '10' : '1'}`}
                    alt=""
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isSensitive ? 'blur-xl scale-110 opacity-30' : 'opacity-50 group-hover:opacity-70 group-hover:scale-105'
                    }`}
                  />

                  {/* Type badge */}
                  <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md
                                ${typeConfig.bg} backdrop-blur-sm text-[10px] font-medium ${typeConfig.color}`}>
                    <Icon size={10} />
                    {img.type}
                  </div>

                  {/* Sensitive overlay */}
                  {isSensitive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/60">
                      <EyeOff size={20} className="text-red-400 mb-1" />
                      <span className="text-[10px] text-red-300 font-medium">Sensitive Content</span>
                      <span className="text-[9px] text-zinc-400 mt-0.5">Click to reveal</span>
                    </div>
                  )}

                  {/* View on Google overlay */}
                  {!isSensitive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0
                                  group-hover:bg-black/40 transition-colors">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1
                                     px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                        <ExternalLink size={12} /> View Image
                      </span>
                    </div>
                  )}

                  {/* Source badge */}
                  {img.source && (
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/60 rounded
                                  text-[9px] text-zinc-300 backdrop-blur-sm">
                      {img.source}
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div className="p-2.5">
                  <p className="text-xs font-medium text-zinc-300 line-clamp-2 group-hover:text-white transition-colors">
                    {img.title}
                  </p>
                  {img.description && (
                    <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{img.description}</p>
                  )}
                </div>
              </a>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-zinc-600 mt-2 italic">
        Images link to Google Image search results. Some images may be sensitive in nature.
      </p>
    </div>
  );
}
