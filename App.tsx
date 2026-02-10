import React, { useState, useEffect } from 'react';
import Controls from './components/Controls';
import ImageWorkspace from './components/ImageWorkspace';
import HistorySidebar from './components/HistorySidebar';
import SplashScreen from './components/SplashScreen';
import { GenerationConfig, GeneratedImage } from './types';
import { generateInitialImage, editImageWithPrompt } from './services/geminiService';
import { Youtube, Key, AlertTriangle, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOutSplash, setFadeOutSplash] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const [config, setConfig] = useState<GenerationConfig>({
    niche: '',
    videoTitle: '',
    thumbnailText: '',
    details: '',
    aspectRatio: '16:9', // Padrão YouTube
    faceModel: null,
    environmentImage: null,
    referenceImage: null,
  });

  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkKey();

    const timer = setTimeout(() => {
      setFadeOutSplash(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 1000);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      setError(null);
    }
  };

  const addToHistory = (image: GeneratedImage) => {
    setHistory((prev) => [image, ...prev]);
  };

  const handleGenerate = async () => {
    if (!hasApiKey && window.aistudio) {
       await handleSelectKey();
    }

    setIsGenerating(true);
    setError(null);
    try {
      const image = await generateInitialImage(
        config.niche,
        config.videoTitle,
        config.thumbnailText,
        config.details,
        config.aspectRatio,
        config.faceModel,
        config.environmentImage
      );
      setGeneratedImage(image);
      addToHistory(image);
    } catch (err: any) {
      const msg = err.message || "Erro na geração";
      setError(msg);
      
      if (msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
        setHasApiKey(false);
        setError("Erro 403: Acesso negado. Selecione uma API Key válida com acesso ao Gemini 3.0 Pro.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async (prompt: string) => {
    if (!generatedImage) return;

    setIsGenerating(true);
    setError(null);
    try {
      const updatedImage = await editImageWithPrompt(
        generatedImage.data,
        generatedImage.mimeType,
        prompt,
        config.aspectRatio,
        generatedImage.caption,
        config.faceModel
      );
      setGeneratedImage(updatedImage);
      addToHistory(updatedImage);
    } catch (err: any) {
      setError(err.message || "Erro na edição");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col font-sans selection:bg-red-900 selection:text-white">
      
      {showSplash && <SplashScreen fadeOut={fadeOutSplash} />}

      {/* Header Pro */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Youtube className="w-8 h-8 text-red-600 fill-current" />
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-black text-white leading-none tracking-tighter uppercase italic">
                TubeMaster <span className="text-red-600 text-lg">3.0</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {(!hasApiKey || (error && error.includes("403"))) && !showSplash && (
               <button 
                onClick={handleSelectKey}
                className="text-xs bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all font-bold uppercase tracking-wider"
               >
                 <Key className="w-3 h-3" />
                 API Key
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1800px] w-full mx-auto px-4 py-6">
        {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-4 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-sm font-medium flex-1">{error}</p>
                <button 
                  onClick={handleSelectKey} 
                  className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded uppercase font-bold tracking-wide"
                >
                  Resolver
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[calc(100vh-120px)]">
          
          {/* Controls */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Controls
              config={config}
              setConfig={setConfig}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
            
            <div className="bg-[#111] border border-[#222] rounded-xl p-5 hidden lg:block">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <PlayCircle className="w-3 h-3 text-red-500" />
                    Estratégia Viral
                </h3>
                <ul className="space-y-3 text-xs text-gray-500">
                    <li className="flex gap-2">
                        <span className="text-red-500 font-bold">1.</span>
                        <span>Use <strong>Saturação Alta</strong>. O Gemini 3.0 é instruído para cores vibrantes.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-red-500 font-bold">2.</span>
                        <span><strong>Texto Curto</strong>: Use o campo "Texto na Thumbnail". Menos de 3 palavras é o ideal para leitura rápida.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-red-500 font-bold">3.</span>
                        <span><strong>Rosto:</strong> O ser humano é programado para olhar rostos. Faça upload de uma selfie com expressão forte.</span>
                    </li>
                </ul>
            </div>
          </div>

          {/* Workspace */}
          <div className="lg:col-span-6 flex flex-col">
            <ImageWorkspace
              image={generatedImage}
              onEdit={handleEdit}
              isProcessing={isGenerating}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 h-full">
            <HistorySidebar 
              history={history} 
              onSelect={setGeneratedImage}
              currentImageId={generatedImage?.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;