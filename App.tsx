import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VoiceSelector from './components/VoiceSelector';
import HistoryItem from './components/HistoryItem';
import LoadingSpinner from './components/LoadingSpinner';
import { VoiceName, GeneratedAudio } from './types';
import { DEFAULT_VOICE, SAMPLE_RATE } from './constants';
import { generateSpeech } from './services/geminiService';
import { decodeBase64, pcmToWavBlob } from './utils/audioUtils';

function App() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(DEFAULT_VOICE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedAudio[]>([]);

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      history.forEach(item => URL.revokeObjectURL(item.blobUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const base64Audio = await generateSpeech({ text, voice: selectedVoice });
      
      // Convert to WAV Blob for standard playback
      const pcmData = decodeBase64(base64Audio);
      const wavBlob = pcmToWavBlob(pcmData, SAMPLE_RATE);
      const blobUrl = URL.createObjectURL(wavBlob);

      const newItem: GeneratedAudio = {
        id: crypto.randomUUID(),
        text: text.trim(),
        voice: selectedVoice,
        blobUrl: blobUrl,
        timestamp: Date.now(),
      };

      setHistory(prev => [newItem, ...prev]);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating speech.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    setHistory(prev => {
      const itemToDelete = prev.find(item => item.id === id);
      if (itemToDelete) {
        URL.revokeObjectURL(itemToDelete.blobUrl);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const handleClear = () => {
      setText('');
      setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Input Section */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                Select Voice
            </h2>
            <VoiceSelector 
                selectedVoice={selectedVoice} 
                onSelect={setSelectedVoice} 
                disabled={isGenerating}
            />

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="text-input" className="text-sm font-medium text-slate-300">
                        Enter text to speak
                    </label>
                    <span className="text-xs text-slate-500">
                        {text.length} characters
                    </span>
                </div>
                <div className="relative">
                    <textarea
                        id="text-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type something here to convert to speech..."
                        className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-lg leading-relaxed shadow-inner"
                        disabled={isGenerating}
                        maxLength={5000}
                    />
                    {text.length > 0 && !isGenerating && (
                         <button 
                            onClick={handleClear}
                            className="absolute top-3 right-3 text-slate-600 hover:text-slate-400 p-1 rounded-md hover:bg-slate-800 transition-colors"
                            title="Clear text"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                         </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500 shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={handleGenerate}
                    disabled={!text.trim() || isGenerating}
                    className={`
                        flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all
                        ${!text.trim() || isGenerating 
                            ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                            : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0'
                        }
                    `}
                >
                    {isGenerating ? (
                        <>
                            <LoadingSpinner />
                            <span>Generating Audio...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                            <span>Generate Speech</span>
                        </>
                    )}
                </button>
            </div>
        </section>

        {/* History Section */}
        {history.length > 0 && (
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-300">Generated History</h3>
                     <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {history.length} items
                     </span>
                </div>
                <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {history.map((item) => (
                        <HistoryItem 
                            key={item.id} 
                            item={item} 
                            onDelete={handleDelete} 
                        />
                    ))}
                </div>
            </section>
        )}
      </main>
    </div>
  );
}

export default App;