import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WatchData from '@/models/WatchData';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    await dbConnect();

    // Fetch the most recent watch data for this user
    const latestData = await WatchData.findOne({ userId }).sort({ createdAt: -1 }).lean();

    if (!latestData) {
      return NextResponse.json({ data: [] });
    }

    // Convert back to the normalized payload format expected by the frontend
    const payload = {
      deviceId: latestData.deviceId,
      heartRate: latestData.heartRate,
      batteryLevel: latestData.batteryLevel,
      steps: latestData.steps,
      stepsGoal: latestData.stepsGoal,
      activeMinutes: latestData.activeMinutes,
      caloriesActive: latestData.caloriesActive,
      spo2: latestData.spo2,
      distance: latestData.distance,
      sleepHours: latestData.sleepHours,
      sleepMinutes: latestData.sleepMinutes,
      sleepScore: latestData.sleepScore,
    };

    return NextResponse.json({ data: [payload] });
  } catch (error) {
    console.error('[Watch Data API] Error fetching:', error);
    return NextResponse.json({ error: 'Failed to fetch watch data' }, { status: 500 });
  }
}
