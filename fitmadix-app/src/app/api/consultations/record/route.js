import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in the environment' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const formData = await req.formData();
    const audioFile = formData.get('audio');
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert audio to base64 for Gemini inline data
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');
    
    // Default fallback to audio/webm if type is missing
    const mimeType = audioFile.type || 'audio/webm';

    // Call Gemini 1.5 Flash for transcription
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Transcribe the following audio accurately, word for word. Do not summarize or add any commentary.' },
            { inlineData: { mimeType: mimeType, data: base64Audio } }
          ]
        }
      ]
    });

    return NextResponse.json({ transcript: response.text });
  } catch (error) {
    console.error('Error during transcription:', error);
    return NextResponse.json({ error: error.message || 'Transcription failed' }, { status: 500 });
  }
}

