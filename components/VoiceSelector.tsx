import React from 'react';
import { AVAILABLE_VOICES } from '../constants';
import { VoiceName } from '../types';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onSelect: (voice: VoiceName) => void;
  disabled?: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {AVAILABLE_VOICES.map((voice) => {
        const isSelected = selectedVoice === voice.id;
        return (
          <button
            key={voice.id}
            onClick={() => onSelect(voice.id)}
            disabled={disabled}
            className={`
              relative flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left
              ${isSelected 
                ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-400' : 'text-slate-200'}`}>
                {voice.name}
              </span>
              {isSelected && (
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="uppercase tracking-wider text-[10px] bg-slate-900/50 px-1.5 py-0.5 rounded text-slate-500 font-bold">
                {voice.gender.substring(0, 1)}
              </span>
              <span className="truncate" title={voice.description}>{voice.description}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default VoiceSelector;