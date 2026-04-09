import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText, Copy, Download, Check, RefreshCw, Settings,
  Clock, Hash, Layers, Sliders, ChevronDown, ChevronUp,
  Sparkles, Loader2
} from 'lucide-react';
import { sampleCases } from '../data/cases';
import { scriptStyles, scriptSections, toneOptions, generateScript as generateScriptLocal } from '../data/scriptTemplates';
import { useAI } from '../hooks/useAI';

export default function ScriptGeneratorPage() {
  const [searchParams] = useSearchParams();
  const preselectedCase = searchParams.get('case');
  const ai = useAI();

  const [selectedCase, setSelectedCase] = useState(preselectedCase || '');
  const [style, setStyle] = useState('podcast-casual');
  const [tone, setTone] = useState('Conversational & Accessible');
  const [duration, setDuration] = useState(15);
  const [selectedSections, setSelectedSections] = useState(
    scriptSections.filter(s => s.required).map(s => s.id)
  );
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [copied, setCopied] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [useAIGeneration, setUseAIGeneration] = useState(true);

  const caseData = useMemo(() =>
    sampleCases.find(c => c.id === parseInt(selectedCase)),
    [selectedCase]
  );

  const toggleSection = (id) => {
    const section = scriptSections.find(s => s.id === id);
    if (section.required) return;
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!caseData) return;

    if (useAIGeneration) {
      try {
        const result = await ai.generateScript(caseData, {
          style, sections: selectedSections, tone, duration,
          includeTimestamps, includeSources,
        });
        setGeneratedScript(result);
        setSettingsOpen(false);
      } catch {
        // Fallback to local generation
        const result = generateScriptLocal(caseData, {
          style, sections: selectedSections, tone, duration,
          includeTimestamps, includeSources,
        });
        setGeneratedScript(result);
        setSettingsOpen(false);
      }
    } else {
      const result = generateScriptLocal(caseData, {
        style, sections: selectedSections, tone, duration,
        includeTimestamps, includeSources,
      });
      setGeneratedScript(result);
      setSettingsOpen(false);
    }
  };

  const handleCopy = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedScript) return;
    const title = caseData ? caseData.title.replace(/\s+/g, '_') : 'script';
    const blob = new Blob([generatedScript.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_script.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Script Generator
        </h1>
        <p className="text-zinc-400">
          Auto-generate professional scripts for podcasts, documentaries, and videos
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-full flex items-center justify-between p-5 text-white font-semibold"
            >
              <span className="flex items-center gap-2">
                <Settings size={18} className="text-red-400" />
                Script Settings
              </span>
              {settingsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {settingsOpen && (
              <div className="px-5 pb-5 space-y-5">
                {/* Case Selection */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                    Select Case
                  </label>
                  <select
                    value={selectedCase}
                    onChange={e => setSelectedCase(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl
                             text-sm text-white outline-none focus:border-red-600"
                  >
                    <option value="">Choose a case...</option>
                    {sampleCases.map(c => (
                      <option key={c.id} value={c.id}>{c.title} ({c.status})</option>
                    ))}
                  </select>
                </div>

                {/* Script Style */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                    Script Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {scriptStyles.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={`p-3 rounded-xl text-left text-sm transition-all ${
                          style === s.id
                            ? 'bg-red-600/10 border border-red-600/30 text-red-400'
                            : 'bg-zinc-800 border border-transparent text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="font-medium">{s.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl
                             text-sm text-white outline-none focus:border-red-600"
                  >
                    {toneOptions.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Target Duration</span>
                    <span className="text-white">{duration} min</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={duration}
                    onChange={e => setDuration(parseInt(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 mt-1">
                    <span>5 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                {/* Sections */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                    Script Sections
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {scriptSections.map(section => (
                      <label
                        key={section.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          selectedSections.includes(section.id)
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-500 hover:bg-zinc-800/50'
                        } ${section.required ? 'cursor-default' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSections.includes(section.id)}
                          onChange={() => toggleSection(section.id)}
                          disabled={section.required}
                          className="accent-red-600 rounded"
                        />
                        <span className="text-sm">{section.name}</span>
                        {section.required && (
                          <span className="text-xs text-zinc-600 ml-auto">Required</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAIGeneration}
                      onChange={e => setUseAIGeneration(e.target.checked)}
                      className="accent-red-600 rounded"
                    />
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Sparkles size={14} className="text-amber-400" />
                      Use Claude AI
                    </span>
                    <span className="text-xs text-zinc-500 ml-auto">Recommended</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTimestamps}
                      onChange={e => setIncludeTimestamps(e.target.checked)}
                      className="accent-red-600 rounded"
                    />
                    Include timestamps
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSources}
                      onChange={e => setIncludeSources(e.target.checked)}
                      className="accent-red-600 rounded"
                    />
                    Include source placeholders
                  </label>
                </div>

                {/* AI Error */}
                {ai.error && (
                  <div className="p-3 bg-red-950/50 border border-red-900/30 rounded-xl text-sm text-red-300">
                    AI Error: {ai.error}. Falling back to template generation.
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedCase || ai.loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600
                           hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600
                           text-white font-semibold rounded-xl transition-all"
                >
                  {ai.loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Claude is writing your script...
                    </>
                  ) : (
                    <>
                      {useAIGeneration ? <Sparkles size={18} /> : <FileText size={18} />}
                      {useAIGeneration ? 'Generate with AI' : 'Generate Script'}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Script Output */}
        <div className="lg:col-span-3">
          {generatedScript ? (
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
              {/* Script Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/50">
                <div>
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    {caseData?.title} — Script
                    {generatedScript?.metadata?.aiGenerated && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20
                                     rounded-full text-xs text-amber-400 font-normal">
                        <Sparkles size={10} /> AI Generated
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Layers size={11} /> {generatedScript.metadata.style}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> ~{generatedScript.metadata.estimatedDuration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash size={11} /> {generatedScript.metadata.wordCount.toLocaleString()} words
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700
                             rounded-lg text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700
                             rounded-lg text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    <Download size={14} />
                    Export
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 border border-red-600/20
                             rounded-lg text-sm text-red-400 hover:bg-red-600/20 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Script Content */}
              <div className="p-5">
                <pre className="whitespace-pre-wrap font-[family-name:var(--font-mono)] text-sm text-zinc-300
                              leading-relaxed">
                  {generatedScript.content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]
                          bg-zinc-900/30 border border-zinc-800/30 rounded-2xl text-center px-8">
              <FileText size={48} className="text-zinc-700 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">No Script Generated</h3>
              <p className="text-zinc-500 max-w-md">
                Select a case and customize your settings, then click "Generate Script" to create
                a professional true crime script.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
