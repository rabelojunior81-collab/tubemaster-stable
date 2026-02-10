import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key não encontrada. Por favor, selecione uma chave válida.");
  }
  return new GoogleGenAI({ apiKey });
};

// MODELOS
const IMAGE_MODEL_NAME = 'gemini-3-pro-image-preview'; // Essencial para texto na imagem e alta fidelidade
const TEXT_MODEL_NAME = 'gemini-2.5-flash'; // Rápido para metadados

const base64ToPart = (base64String: string) => {
  let mimeType = 'image/jpeg';
  let data = base64String;

  const match = base64String.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (match) {
    mimeType = match[1];
    data = match[2];
  } else if (base64String.includes('base64,')) {
    const split = base64String.split('base64,');
    data = split[1];
  }
  
  return {
    inlineData: {
      data: data,
      mimeType: mimeType
    }
  };
};

export const generateInitialImage = async (
  niche: string,
  videoTitle: string,
  thumbnailText: string,
  details: string,
  aspectRatio: string,
  faceModel?: string | null,
  environmentImage?: string | null,
  referenceImage?: string | null
): Promise<GeneratedImage> => {
  const ai = getAiClient();
  
  // 1. Construção do Contexto Visual para YouTube
  let visualReferences = "";
  if (faceModel) {
    visualReferences += `
    *** YOUTUBER AVATAR (REACTION FACE) ***
    A imagem #1 é o Criador de Conteúdo. 
    AÇÃO: Insira esta pessoa na thumbnail com uma expressão facial exagerada e emotiva (Choque, Alegria Extrema, Raiva, Dúvida) adequada ao título "${videoTitle}".
    ILUMINAÇÃO: Use "Rim Light" (Luz de recorte) colorida para separar o sujeito do fundo.
    `;
  }
  
  if (environmentImage) {
    visualReferences += `
    *** BACKGROUND / CONTEXTO ***
    A imagem fornecida (#2) é o jogo, produto ou local do vídeo. Use-a como base para o fundo ou elemento principal, mas aumente a saturação e o contraste para ficar "pop".
    `;
  }

  // 2. Prompt Otimizado para Gemini 3.0 (Typography & Composition)
  const imagePrompt = `Crie uma THUMBNAIL VIRAL DE YOUTUBE (High CTR Style).
  
  DADOS DO VÍDEO:
  - Nicho: ${niche}
  - Título/Tema: ${videoTitle}
  - Detalhes Extras: ${details}

  ELEMENTO OBRIGATÓRIO (TEXTO NA IMAGEM):
  ${thumbnailText ? `Escreva o texto "${thumbnailText}" na imagem. O texto deve ser GRANDE, em 3D ou Neon, com fonte impactante (Sans Serif Bold), legível e contrastante com o fundo. A cor do texto deve destacar (Amarelo, Vermelho, Branco Brilhante).` : 'Não insira texto, foque apenas na imagem impactante.'}
  
  ESTÉTICA (YOUTUBE MASTER):
  - Estilo: Hiper-realista, 8K, Renderização estilo Unreal Engine 5 ou Fotografia de Estúdio de Alta Voltagem.
  - Composição: Regra dos terços. Sujeito principal (Rosto ou Objeto) bem definido e grande. Fundo levemente desfocado (Bokeh) para profundidade.
  - Cores: Alta Saturação, Contraste Vibrante. Cores complementares (Laranja/Azul, Roxo/Verde).
  - Vibe: Energética, Misteriosa ou Urgente (dependendo do título).
  
  ${visualReferences}
  
  Se não houver imagem de referência de rosto, crie um personagem genérico expressivo adequado ao nicho (ex: Gamer com headset, Tech reviewer segurando gadget).
  `;

  // 3. Prompt para Metadados (SEO)
  const metadataPrompt = `Atue como um Especialista em SEO para YouTube (MrBeast Strategist).
  Analise o tema: "${videoTitle}" no nicho "${niche}".
  
  Gere um JSON (texto formatado) com:
  1. 5 Variações de Títulos Virais (Clickbait Ético, Curto, Impactante).
  2. Descrição (Primeiras 3 linhas focadas no gancho + Roteiro de introdução de 30 segundos).
  3. 15 Tags de Alta Relevância.
  4. Análise de Padrão: Por que esse estilo de thumbnail funciona para esse tópico?
  `;

  try {
    const parts: any[] = [{ text: imagePrompt }];
    
    // Ordem de inserção das imagens no array parts
    if (faceModel) parts.push(base64ToPart(faceModel));
    if (environmentImage) parts.push(base64ToPart(environmentImage));
    if (referenceImage) parts.push(base64ToPart(referenceImage));

    const [imageResponse, metadataResponse] = await Promise.all([
      ai.models.generateContent({
        model: IMAGE_MODEL_NAME,
        contents: { parts },
        config: {
          imageConfig: { aspectRatio: aspectRatio }
        },
      }),
      ai.models.generateContent({
        model: TEXT_MODEL_NAME,
        contents: metadataPrompt,
      })
    ]);

    const image = extractImageFromResponse(imageResponse, imagePrompt);
    image.caption = metadataResponse.text;
    
    return image;
  } catch (error) {
    console.error("Erro na geração:", error);
    throw error;
  }
};

export const editImageWithPrompt = async (
  base64Image: string,
  mimeType: string,
  editPrompt: string,
  aspectRatio: string,
  currentCaption?: string,
  faceModel?: string | null
): Promise<GeneratedImage> => {
  const ai = getAiClient();
  try {
    const parts: any[] = [
      {
        text: `EDITE ESTA THUMBNAIL DE YOUTUBE.
        Instrução: ${editPrompt}.
        Mantenha a alta saturação e legibilidade do texto se houver.
        Mantenha a identidade do YouTuber se fornecida.`,
      },
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      }
    ];

    if (faceModel) {
        parts.push(base64ToPart(faceModel));
    }

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: { parts },
      config: {
        imageConfig: { aspectRatio }
      }
    });

    const image = extractImageFromResponse(response, editPrompt);
    image.caption = currentCaption; 
    
    return image;
  } catch (error) {
    console.error("Erro na edição:", error);
    throw error;
  }
};

const extractImageFromResponse = (response: any, originalPrompt: string): GeneratedImage => {
  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("Sem resposta da IA.");
  }
  const parts = candidates[0].content.parts;
  const imagePart = parts.find((p: any) => p.inlineData);

  if (!imagePart) {
    throw new Error("A IA não gerou uma imagem. Tente simplificar o texto da thumbnail.");
  }

  return {
    id: crypto.randomUUID(),
    data: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || 'image/png',
    prompt: originalPrompt,
    timestamp: Date.now(),
  };
};