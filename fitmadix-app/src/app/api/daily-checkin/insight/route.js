import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const data = await req.json();
    const { energyLevel, mood, symptoms, lifestyle } = data;

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          insight: '⚠️ **Configuration Required**: Gemini API key is missing. Please add `GEMINI_API_KEY=your_key` to your `.env.local` file.\n\n*This is a mock insight. Based on your input, try to get more rest and stay hydrated.*' 
        }), 
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `You are an empathetic Health AI assistant for the Fitmadix app. The user just completed their daily health check-in.
Here is their data for today:
- Energy Level: ${energyLevel || 'Not specified'}
- Mood: ${mood || 'Not specified'}
- Symptoms: ${symptoms && symptoms.length > 0 ? symptoms.join(', ') : 'None'}
- Sleep Quality: ${lifestyle?.sleep || 'Not specified'}

Based on this, please provide a short, supportive response (about 3-4 sentences max) that includes:
1. A brief reflection on how they are feeling today.
2. Potential causes for this state (especially if they have negative symptoms or low energy).
3. 1-2 practical, actionable tips on how to improve or maintain their wellbeing today.

Format the response using basic HTML tags (<b>, <ul>, <li>, <br>, <p>). Do not use Markdown. Keep it encouraging but professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return new Response(JSON.stringify({ insight: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate insight', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
