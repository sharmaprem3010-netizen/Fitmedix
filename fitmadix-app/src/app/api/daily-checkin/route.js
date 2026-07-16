import dbConnect from '@/lib/db';
import DailyCheckin from '@/models/DailyCheckin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    // If no session, we can either block it or allow a general local state
    // For now let's allow it so it works without auth if needed
    let userId = null;
    if (session?.user?.email) {
      // Find the user by email if needed, or just use email as ID placeholder
      // For simplicity in this demo, let's just query by date
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return new Response(JSON.stringify({ error: 'Date is required' }), { status: 400 });
    }

    await dbConnect();
    const checkin = await DailyCheckin.findOne({ date }).lean();

    return new Response(JSON.stringify({ checkin }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { date, energyLevel, mood, symptoms, lifestyle } = data;

    if (!date) {
      return new Response(JSON.stringify({ error: 'Date is required' }), { status: 400 });
    }

    await dbConnect();
    
    // Update or Create
    const checkin = await DailyCheckin.findOneAndUpdate(
      { date },
      { date, energyLevel, mood, symptoms, lifestyle },
      { new: true, upsert: true }
    );

    return new Response(JSON.stringify({ checkin }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
