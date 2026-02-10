import React, { useRef } from 'react';
import { GenerationConfig } from '../types';
import { Sparkles, Youtube, MonitorPlay, Type, Image as ImageIcon, Upload, X, UserSquare2, Gamepad2, AlertCircle } from 'lucide-react';

interface ControlsProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig, onGenerate, isGenerating }) => {
  const faceInputRef = useRef<HTMLInputElement>(null);
  const environmentInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof GenerationConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'faceModel' | 'environmentImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange(field, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (field: 'faceModel' | 'environmentImage') => {
    handleChange(field, null);
    if (field === 'faceModel' && faceInputRef.current) faceInputRef.current.value = '';
    if (field === 'environmentImage' && environmentInputRef.current) environmentInputRef.current.value = '';
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Red Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

      <div className="mb-6 flex items-center space-x-3 pb-4 border-b border-[#333]">
        <div className="bg-red-600 p-2 rounded-lg text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]">
           <Youtube className="w-6 h-6 fill-current" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Studio Config</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">TubeMaster 3.0</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Niche & Title */}
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-2 uppercase">
                    <MonitorPlay className="w-3 h-3 text-red-500" /> Nicho do Canal
                </label>
                <input
                    type="text"
                    value={config.niche}
                    onChange={(e) => handleChange('niche', e.target.value)}
                    placeholder="ex: Gaming, Tech, Curiosidades, Finanças"
                    className="w-full bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
            </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-2 uppercase">
            <Type className="w-3 h-3 text-red-500" /> Título do Vídeo (Ideia)
          </label>
          <input
            type="text"
            value={config.videoTitle}
            onChange={(e) => handleChange('videoTitle', e.target.value)}
            placeholder="ex: Comprei o iPhone 16 Pro e ME ARREPENDI?"
            className="w-full bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-medium"
          />
        </div>

        {/* Thumbnail Text (Typography) */}
        <div>
          <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-2 uppercase">
            <Type className="w-3 h-3 text-yellow-500" /> Texto na Thumbnail (Curto & Impactante)
          </label>
          <input
            type="text"
            value={config.thumbnailText}
            onChange={(e) => handleChange('thumbnailText', e.target.value)}
            placeholder="ex: DEU RUIM!, R$ 10 vs R$ 1000, INACREDITÁVEL"
            className="w-full bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-3 text-yellow-400 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-bold tracking-wide"
          />
          <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
             <AlertCircle className="w-3 h-3" />
             <span>O Gemini 3.0 renderizará este texto dentro da imagem. Mantenha curto (Max 3 palavras).</span>
          </div>
        </div>

        {/* Uploads Section */}
        <div className="grid grid-cols-2 gap-4">
            {/* Face / Avatar */}
            <div>
            <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-2 uppercase">
                <UserSquare2 className="w-3 h-3 text-blue-400" /> Seu Rosto (Reaction)
            </label>
            {!config.faceModel ? (
                <div 
                onClick={() => faceInputRef.current?.click()}
                className="aspect-video w-full border border-dashed border-[#444] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#222] hover:border-blue-500 transition-all group"
                >
                <Upload className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
                <span className="text-[10px] text-gray-500">Upload Rosto</span>
                <input ref={faceInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'faceModel')} className="hidden" />
                </div>
            ) : (
                <div className="relative aspect-video w-full bg-[#0f0f0f] border border-[#333] rounded-lg overflow-hidden group">
                <img src={config.faceModel} alt="Face" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <button onClick={() => clearFile('faceModel')} className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white hover:text-red-500"><X className="w-3 h-3" /></button>
                </div>
            )}
            </div>

            {/* Background / Game */}
            <div>
            <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-2 uppercase">
                <Gamepad2 className="w-3 h-3 text-green-400" /> Jogo / Produto / Fundo
            </label>
            {!config.environmentImage ? (
                <div 
                onClick={() => environmentInputRef.current?.click()}
                className="aspect-video w-full border border-dashed border-[#444] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#222] hover:border-green-500 transition-all group"
                >
                <Upload className="w-5 h-5 text-gray-500 group-hover:text-green-400" />
                <span className="text-[10px] text-gray-500">Upload Fundo</span>
                <input ref={environmentInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'environmentImage')} className="hidden" />
                </div>
            ) : (
                <div className="relative aspect-video w-full bg-[#0f0f0f] border border-[#333] rounded-lg overflow-hidden group">
                <img src={config.environmentImage} alt="Env" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <button onClick={() => clearFile('environmentImage')} className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white hover:text-red-500"><X className="w-3 h-3" /></button>
                </div>
            )}
            </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-2 uppercase">
            <Sparkles className="w-3 h-3 text-purple-500" /> Detalhes Visuais (Prompt Extra)
          </label>
          <textarea
            value={config.details}
            onChange={(e) => handleChange('details', e.target.value)}
            placeholder="ex: Explosão no fundo, setas vermelhas apontando, cara de surpresa extrema..."
            rows={2}
            className="w-full bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all resize-none text-sm"
          />
        </div>

        {/* Aspect Ratio - Locked to YouTube primarily */}
        <div>
          <label className="text-xs font-bold text-gray-400 mb-2 uppercase">Formato</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: '16:9', label: 'YouTube Standard', desc: '1920x1080' },
              { id: '9:16', label: 'Shorts / TikTok', desc: '1080x1920' },
            ].map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => handleChange('aspectRatio', ratio.id as any)}
                className={`flex flex-col items-center justify-center py-3 rounded-lg text-sm font-bold transition-all border ${
                  config.aspectRatio === ratio.id
                    ? 'bg-red-600 border-red-500 text-white shadow-lg'
                    : 'bg-[#0f0f0f] border-[#333] text-gray-500 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                <span>{ratio.id}</span>
                <span className="text-[10px] opacity-70 font-normal">{ratio.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !config.niche || !config.videoTitle}
          className={`w-full py-4 rounded-lg font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 uppercase tracking-wider ${
            isGenerating || !config.niche || !config.videoTitle
              ? 'bg-[#222] text-gray-600 cursor-not-allowed border border-[#333]'
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-500 hover:shadow-red-900/50'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Renderizando...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-white" />
              Gerar Thumbnail
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;