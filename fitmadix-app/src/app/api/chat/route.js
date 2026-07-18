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
          reply: '👋 **Welcome to the Fitmadix AI Health Guide!**\n\nI\'m currently running in demo mode. Here are some general health tips:\n\n- **Stay Hydrated**: Drink at least 8 glasses of water daily\n- **Move More**: Aim for 30 minutes of activity each day\n- **Sleep Well**: Target 7-9 hours of quality sleep\n- **Eat Balanced**: Include fruits, vegetables, and whole grains\n\n*For personalized AI responses, the administrator needs to configure the Gemini API key.*\n\n⚠️ *I am an AI assistant, not a doctor. Always consult a healthcare professional for medical advice.*' 
        }), 
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Call the Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    return new Response(JSON.stringify({ 
      reply: 'Sorry, I encountered an issue processing your request. Please try again in a moment.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
