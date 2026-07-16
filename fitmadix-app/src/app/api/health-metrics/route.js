import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import WatchData from "@/models/WatchData";
import HdtSignal from "@/models/HdtSignal";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    await dbConnect();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Fetch Google Fit (Cloud) Data
    const cloudData = await WatchData.findOne({
      userId,
      createdAt: { $gte: startOfDay }
    }).sort({ createdAt: -1 }).lean();

    // Fetch Mobile Bridge (Apple Health / Health Connect) Data
    const mobileDataList = await HdtSignal.find({
      userId,
      timestamp: { $gte: startOfDay }
    }).sort({ timestamp: -1 }).lean();

    // We'll aggregate the highest or most recent values
    let totalSteps = 0;
    let avgHeartRate = 0;
    let caloriesActive = 0;
    let primarySource = 'none';

    // Parse Cloud Data
    if (cloudData) {
      totalSteps = cloudData.steps || 0;
      avgHeartRate = cloudData.heartRate || 0;
      caloriesActive = cloudData.caloriesActive || 0;
      primarySource = 'google_fit';
    }

    // Parse Mobile Data (it might override if values are higher)
    for (const data of mobileDataList) {
      const source = data.source; // 'apple_health' or 'health_connect'
      const metrics = data.metrics || {};
      
      let updated = false;

      // In real-world, Apple/HealthConnect sync more frequently, so we prefer their larger values
      if (metrics.steps && metrics.steps > totalSteps) {
        totalSteps = metrics.steps;
        updated = true;
      }
      
      if (metrics.hr && metrics.hr > 0 && avgHeartRate === 0) {
        avgHeartRate = metrics.hr;
        updated = true;
      }

      if (metrics.calories && metrics.calories > caloriesActive) {
        caloriesActive = metrics.calories;
        updated = true;
      }

      if (updated) {
        primarySource = source;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        primarySource,
        metrics: {
          totalSteps,
          avgHeartRate,
          caloriesActive
        }
      }
    });

  } catch (err) {
    console.error('[Health Metrics API] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
