import dbConnect from '@/lib/db';
import Schedule from '@/models/Schedule';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI features require a Gemini API key. Please configure GEMINI_API_KEY in your environment variables.' }), { status: 503 });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    await dbConnect();
    const data = await req.json();
    const { date } = data;

    if (!date) {
      return new Response(JSON.stringify({ error: 'Date is required' }), { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const prompt = `Generate a healthy, balanced daily schedule for a user for the date ${date}. 
Include exactly 4 or 5 items. The items should include things like waking up, a healthy meal, exercise or a medical checkup/reminder, and relaxation.
Respond ONLY with a valid JSON array of objects. Do not use Markdown formatting or backticks.
Each object must have exactly these keys:
"time" (string, e.g. "08:00 AM")
"title" (string, e.g. "Morning Yoga" or "Breakfast")
"type" (string, a short subtitle e.g. "Stretching" or "Oatmeal & Fruits")
"icon" (string, a single suitable emoji e.g. "🧘" or "🍎")

Example format:
[
  { "time": "08:00 AM", "title": "Morning Walk", "type": "Light Cardio", "icon": "🚶" }
]`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let generatedSchedule;
    try {
      const textResponse = aiResponse.text;
      // Try parsing the full response first
      generatedSchedule = JSON.parse(textResponse);
      // If it parsed as an object with an array inside, extract the array
      if (!Array.isArray(generatedSchedule)) {
        const values = Object.values(generatedSchedule);
        generatedSchedule = values.find(v => Array.isArray(v)) || [];
      }
    } catch (err) {
      console.error("AI parse error:", err, "Raw text:", aiResponse.text);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response. Please try again.' }), { status: 500 });
    }

    // Save generated schedule to DB
    const savedItems = [];
    for (const item of generatedSchedule) {
      const newSchedule = await Schedule.create({
        userId: userId || null,
        date,
        time: item.time,
        title: item.title,
        type: item.type,
        icon: item.icon
      });
      savedItems.push(newSchedule);
    }

    return new Response(JSON.stringify({ success: true, schedules: savedItems }), { status: 201 });
  } catch (error) {
    console.error("Schedule AI error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
