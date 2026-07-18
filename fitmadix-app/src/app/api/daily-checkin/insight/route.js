export async function POST(req) {
  try {
    const data = await req.json();
    const { energyLevel, mood, symptoms, lifestyle } = data;

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          insight: '<p><b>👋 Welcome to your Daily Insight!</b></p><p>Based on your check-in today, here are some general tips:</p><ul><li>Stay hydrated — aim for 8 glasses of water</li><li>Take short breaks every 90 minutes if working</li><li>A 10-minute walk can boost both mood and energy</li></ul><p><i>Note: Connect the Gemini AI key for personalized insights.</i></p>' 
        }), 
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return new Response(JSON.stringify({ insight: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(JSON.stringify({ 
      insight: '<p>We couldn\'t generate a personalized insight right now. Please try again later.</p>' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
