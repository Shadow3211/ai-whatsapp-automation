import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GenerateSpeechParams {
  text: string;
  voice: VoiceName;
}

export const generateSpeech = async ({ text, voice }: GenerateSpeechParams): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    // Check for candidates and inline data
    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.[0];

    if (!audioPart || !audioPart.inlineData || !audioPart.inlineData.data) {
      console.error("Gemini Response Dump:", JSON.stringify(response, null, 2));
      throw new Error("No audio data received from Gemini. Check console for details.");
    }

    return audioPart.inlineData.data;
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    throw new Error(error.message || "Failed to generate speech.");
  }
};
