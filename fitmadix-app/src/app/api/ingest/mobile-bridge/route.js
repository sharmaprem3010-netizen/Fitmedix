import dbConnect from '@/lib/db';
import WatchData from '@/models/WatchData';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

/**
 * Mobile Bridge Ingestion Endpoint
 * 
 * Companion mobile apps (iOS Apple Health / Android Health Connect)
 * should POST data to this endpoint.
 * 
 * Authentication: 
 * - The request must include the session cookie (if using a webview or same-domain proxy)
 * - Or implement a Bearer token verification if the mobile app has its own API token strategy.
 */
export async function POST(req) {
  try {
    // 1. Authenticate Request
    const session = await getServerSession(authOptions);
    let userId;

    if (session && session.user) {
      userId = session.user.id || session.user.email;
    } else {
      // Fallback for API tokens if implemented later
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
      
      // TODO: Verify the Bearer token (e.g. JWT verification against a secret)
      // For now, if no session, we block it.
      return new Response(JSON.stringify({ error: 'Unauthorized: Session required' }), { status: 401 });
    }

    // 2. Parse Payload
    const body = await req.json();
    const { 
      source, // e.g. "Apple Health", "Health Connect"
      heartRate, 
      steps, 
      activeMinutes, 
      sleepHours, 
      sleepScore,
      distance 
    } = body;

    // 3. Save to Database
    await dbConnect();
    
    // We update today's existing record or create a new one
    // Finding today's record by sorting by createdAt descending or using a date range
    
    // For simplicity, we just insert a new WatchData snapshot or upsert the latest one
    const newRecord = await WatchData.findOneAndUpdate(
      { userId, deviceId: source || 'Mobile Device' },
      {
        $set: {
          heartRate: heartRate || undefined,
          steps: steps || undefined,
          activeMinutes: activeMinutes || undefined,
          sleepHours: sleepHours || undefined,
          sleepScore: sleepScore || undefined,
          distance: distance || undefined,
          createdAt: new Date()
        }
      },
      { upsert: true, new: true, sort: { createdAt: -1 } }
    );

    return new Response(JSON.stringify({ success: true, data: newRecord }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Mobile Bridge Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: String(error) }), { status: 500 });
  }
}
