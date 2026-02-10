import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, Wand2, RefreshCw, AlertCircle, Copy, Check, FileText, Youtube } from 'lucide-react';

interface ImageWorkspaceProps {
  image: GeneratedImage | null;
  onEdit: (prompt: string) => void;
  isProcessing: boolean;
}

const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({ image, onEdit, isProcessing }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.data}`;
    link.download = `tubemaster-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim()) {
      onEdit(editPrompt);
      setEditPrompt('');
    }
  };

  const handleCopyCaption = () => {
    if (image?.caption) {
      navigator.clipboard.writeText(image.caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!image) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-[#111] border-2 border-dashed border-[#222] rounded-xl p-8 text-center group">
        <div className="bg-[#1a1a1a] p-6 rounded-full mb-6 group-hover:bg-[#222] transition-colors shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          <Youtube className="w-12 h-12 text-gray-600 group-hover:text-red-600 transition-colors" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Aguardando Input</h3>
        <p className="text-gray-500 max-w-md">
          Preencha os dados à esquerda para criar sua primeira thumbnail viral. 
          <br/>O <span className="text-red-500 font-semibold">Gemini 3.0</span> escreverá o texto na imagem para você.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Canvas Area */}
      <div className="relative group rounded-xl overflow-hidden bg-black shadow-2xl border border-[#222]">
        <div className="relative w-full h-full min-h-[350px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
           <img
            src={`data:${image.mimeType};base64,${image.data}`}
            alt="Thumbnail"
            className={`w-full h-auto object-contain shadow-lg transition-all duration-500 ${isProcessing ? 'opacity-30 blur-sm grayscale' : 'opacity-100'}`}
          />
           {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-black/80 px-8 py-4 rounded-full flex items-center gap-4 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.3)] backdrop-blur-md">
                 <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500"></div>
                 <span className="text-white font-bold tracking-wide uppercase text-sm">Gerando Pixel Perfect...</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Download className="w-4 h-4" /> Baixar
          </button>
        </div>
      </div>

      {/* Edit Bar */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-4">
        <h3 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Wand2 className="w-3 h-3 text-red-500" />
            AI Refiner
        </h3>
        <form onSubmit={handleEditSubmit} className="flex gap-3">
          <input
            type="text"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="ex: Mude o texto para 'PERDI TUDO', faça a expressão mais triste, adicione fogo..."
            className="flex-1 bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !editPrompt.trim()}
            className="px-6 bg-[#222] hover:bg-white hover:text-black text-white border border-[#333] rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          </button>
        </form>
      </div>

      {/* Metadata Section */}
      {image.caption && (
        <div className="bg-[#111] border border-[#222] rounded-xl p-5 flex-1 flex flex-col min-h-[200px]">
          <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
            <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-3 h-3 text-blue-500" />
              SEO & Títulos Virais
            </h3>
            <button
              onClick={handleCopyCaption}
              className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <textarea
            readOnly
            value={image.caption}
            className="flex-1 w-full bg-[#0f0f0f] text-gray-300 text-sm font-mono leading-relaxed resize-none focus:outline-none p-3 rounded-lg border border-[#222]"
          />
        </div>
      )}
    </div>
  );
};

export default ImageWorkspace;