import React from 'react';
import { GeneratedAudio } from '../types';

interface HistoryItemProps {
  item: GeneratedAudio;
  onDelete: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-4 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md uppercase tracking-wide">
                {item.voice}
            </span>
            <span className="text-xs text-slate-500">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
        <button 
            onClick={() => onDelete(item.id)}
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
            title="Delete"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
      
      <p className="text-slate-300 text-sm mb-4 line-clamp-2 italic border-l-2 border-slate-700 pl-3">
        "{item.text}"
      </p>

      <div className="bg-slate-900/50 rounded-lg p-2">
        <audio controls className="w-full h-8 block audio-player-custom">
            <source src={item.blobUrl} type="audio/wav" />
            Your browser does not support the audio element.
        </audio>
      </div>
      
      <div className="mt-2 flex justify-end">
          <a 
            href={item.blobUrl} 
            download={`gemini-vox-${item.id.slice(0, 8)}.wav`}
            className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3.375-3.375M12 12.75l3.375-3.375M12 12.75V3" />
            </svg>
            Download WAV
          </a>
      </div>
    </div>
  );
};

export default HistoryItem;