import React from 'react';
import { GeneratedImage } from '../types';
import { Clock, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface HistorySidebarProps {
  history: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  currentImageId?: string;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, currentImageId }) => {
  if (history.length === 0) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 h-full flex flex-col items-center justify-center text-center text-gray-600">
        <Clock className="w-8 h-8 mb-3 opacity-30" />
        <p className="text-xs font-medium">Histórico vazio.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-4 h-full flex flex-col max-h-[800px]">
      <div className="flex items-center gap-2 mb-4 px-1 pb-2 border-b border-[#222]">
        <Clock className="w-3 h-3 text-red-600" />
        <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Histórico</h2>
      </div>

      <div className="overflow-y-auto space-y-2 flex-1 pr-1 custom-scrollbar">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full group flex gap-3 p-2 rounded-lg border transition-all ${
              currentImageId === item.id
                ? 'bg-[#222] border-red-900/50'
                : 'bg-transparent border-transparent hover:bg-[#1a1a1a] hover:border-[#333]'
            }`}
          >
            <div className="relative w-20 aspect-video shrink-0 bg-black rounded overflow-hidden border border-[#333]">
              <img
                src={`data:${item.mimeType};base64,${item.data}`}
                alt="Miniatura"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start justify-center min-w-0 flex-1">
              <p className="text-[11px] text-gray-300 line-clamp-2 text-left w-full font-medium leading-tight">
                {item.prompt.slice(0, 50)}...
              </p>
              <p className="text-[9px] text-gray-600 mt-1 font-mono">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistorySidebar;