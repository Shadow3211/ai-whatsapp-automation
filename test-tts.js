import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env
dotenv.config();
// Load .env.local override
if (fs.existsSync('.env.local')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.error('❌ API_KEY not found in .env or .env.local');
  process.exit(1);
}

console.log('🔑 Found API Key:', API_KEY.substring(0, 5) + '...');

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function testTTS() {
  console.log('🚀 Testing Gemini TTS Model: gemini-2.5-flash-preview-tts');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: 'Hello, this is a test.' }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.[0];

    if (audioPart && audioPart.inlineData && audioPart.inlineData.data) {
      console.log('✅ SUCCESS: Audio data received!');
      console.log('📦 Data length:', audioPart.inlineData.data.length);
    } else {
      console.error('❌ FAILURE: No audio data in response.');
      console.error('Dump:', JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error('❌ EXCEPTION:', error);
  }
}

testTTS();
