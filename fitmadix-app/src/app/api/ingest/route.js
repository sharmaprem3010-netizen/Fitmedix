import { NextResponse } from 'next/server';
import { normalizePayload } from '@/utils/normalize';
import dbConnect from '@/lib/db';
import WatchData from '@/models/WatchData';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const rawData = await req.json();
    
    let watchDataPayload = {};

    if (rawData.type === 'MANUAL_SYNC') {
      // Manual sync from dashboard Quick Sync
      watchDataPayload = {
        deviceId: rawData.deviceId,
        heartRate: rawData.metrics.heartRate,
        batteryLevel: rawData.metrics.batteryLevel,
        steps: rawData.metrics.steps,
        caloriesActive: rawData.metrics.calories,
        spo2: rawData.metrics.spo2,
        distance: rawData.metrics.distance,
        sleepHours: rawData.metrics.sleepHours,
        sleepMinutes: rawData.metrics.sleepMinutes
      };
    } else {
      // Data from Mobile Bridge App (iOS HealthKit / Android Health Connect)
      const unifiedData = normalizePayload(rawData);
      if (!unifiedData) {
        return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
      }
      watchDataPayload = {
        deviceId: unifiedData.deviceId,
        steps: unifiedData.metrics.totalSteps,
        heartRate: unifiedData.metrics.avgHeartRate
      };
    }

    await dbConnect();

    // 2. Store in Database
    const record = new WatchData({
      userId,
      ...watchDataPayload
    });
    
    await record.save();
    
    console.log('[Health Ingest API] Saved to MongoDB for user:', userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Data synced securely via bridge to MongoDB',
      record_id: record._id
    }, { status: 200 });

  } catch (error) {
    console.error('[Health Ingest API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Ingest API is ready. Use POST to send data, or use /api/watch-data to fetch it.'
  });
}
