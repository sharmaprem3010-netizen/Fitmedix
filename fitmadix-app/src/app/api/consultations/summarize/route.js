import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import dbConnect from '@/lib/db';
import Consultation from '@/models/Consultation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const { transcript, language = 'en' } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const prompt = `You are a medical assistant extracting information from a doctor-patient consultation transcript.
Translate your output to this language: ${language}.
Analyze the following transcript:
${transcript}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a precise medical assistant. Output only valid JSON matching the schema.',
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of diagnoses"
            },
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  frequency: { type: Type.STRING }
                }
              },
              description: "List of medications prescribed"
            },
            tests: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of recommended tests or follow-ups"
            },
            lifestyleAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of lifestyle advice given"
            },
            nextAppointment: {
              type: Type.STRING,
              description: "Next appointment date or 'None mentioned'"
            }
          }
        }
      }
    });

    let summaryData;
    try {
      summaryData = JSON.parse(response.text);
    } catch (e) {
      console.error('Failed to parse Gemini JSON:', response.text);
      return NextResponse.json({ error: 'Failed to parse AI summary' }, { status: 500 });
    }

    await dbConnect();

    const newConsultation = new Consultation({
      userId,
      rawTranscript: transcript,
      summary: summaryData,
      language,
      audioRetentionUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await newConsultation.save();

    return NextResponse.json({ success: true, consultation: newConsultation });
  } catch (error) {
    console.error('Error during summarization:', error);
    return NextResponse.json({ error: error.message || 'Summarization failed' }, { status: 500 });
  }
}
