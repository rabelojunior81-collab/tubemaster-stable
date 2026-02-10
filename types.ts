
export interface GenerationConfig {
  niche: string;
  videoTitle: string; // Título do vídeo (ideia)
  thumbnailText: string; // Texto curto para renderizar na imagem
  details: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  faceModel: string | null; // Rosto do Youtuber
  environmentImage: string | null; // Screenshot do jogo/produto/fundo
  referenceImage: string | null; // Referência de estilo
}

export interface GeneratedImage {
  id: string;
  data: string; // Base64 string
  mimeType: string;
  prompt: string;
  timestamp: number;
  caption?: string; // Metadata (Títulos virais, descrição)
}

export interface LoadingState {
  isGenerating: boolean;
  message: string;
}