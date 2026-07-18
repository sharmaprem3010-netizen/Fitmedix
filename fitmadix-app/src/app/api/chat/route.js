import { GoogleGenAI } from '@google/genai';

// Initialize the Google GenAI SDK.
// It will automatically use the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          reply: '⚠️ **Configuration Required**: Gemini API key is missing. Please add `GEMINI_API_KEY=your_key` to your `.env.local` file.\n\n*This is a mock response because the API key is not set up yet.*' 
        }), 
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Call the Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are a helpful, professional, and empathetic AI Health Guide for the "Fitmadix" medical app. 
          Your goal is to provide general medical information, health tips, and explain symptoms.
          Always include a disclaimer that you are an AI and they should consult a doctor for serious issues.
          Use markdown formatting for lists, bold text, and clear readability.
          
          User message: ${message}` }],
        }
      ],
    });

    return new Response(JSON.stringify({ reply: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
