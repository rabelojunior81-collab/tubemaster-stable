import React, { useEffect, useState } from 'react';
import { Youtube, Zap, Type, Image as ImageIcon } from 'lucide-react';

interface SplashScreenProps {
  fadeOut: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ fadeOut }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // Faster load for "Pro" feel
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out px-4 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-red-600 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse"></div>
          <div className="relative bg-[#0f0f0f] p-8 rounded-3xl border border-[#333] shadow-2xl flex items-center justify-center">
            <Youtube className="w-20 h-20 text-red-600 fill-current" />
          </div>
        </div>

        <div className="text-center space-y-2 mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                TubeMaster <span className="text-red-600">3.0</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide">
                AI Thumbnail Architect & Viral Script Generator
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-16">
            {[
                { icon: <Zap className="w-5 h-5 text-yellow-400" />, title: "High CTR Strategy", desc: "Modelos treinados em métricas de MrBeast e canais virais." },
                { icon: <Type className="w-5 h-5 text-blue-400" />, title: "3.0 Text Rendering", desc: "A única IA que escreve texto perfeito dentro da thumbnail." },
                { icon: <ImageIcon className="w-5 h-5 text-green-400" />, title: "8K Hyper-Realism", desc: "Iluminação de estúdio e expressões faciais emotivas." }
            ].map((item, i) => (
                <div key={i} className="bg-[#111] border border-[#222] p-6 rounded-xl text-center hover:border-red-900/30 transition-colors">
                    <div className="flex justify-center mb-3">{item.icon}</div>
                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Pro Loading Bar */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-[10px] text-gray-500 mb-2 font-mono uppercase">
            <span>Initializing Gemini 3.0 Pro...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 bg-[#222] w-full overflow-hidden">
            <div 
              className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]"
              style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SplashScreen;