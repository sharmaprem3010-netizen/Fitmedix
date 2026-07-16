import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getFreshAccessToken, hasProviderTokens } from "@/lib/secureTokenStore";
import dbConnect from "@/lib/db";
import WatchData from "@/models/WatchData";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const subject = session.user.id || session.user.email;

    // Check if we have Google Fit connected
    const hasTokens = await hasProviderTokens({ provider: 'google-fit', subject });
    if (!hasTokens) {
      return NextResponse.json({ error: 'Google Fit not connected' }, { status: 403 });
    }

    // Fetch a fresh token (auto-refreshes if expired)
    let accessToken;
    try {
      accessToken = await getFreshAccessToken({ provider: 'google-fit', subject });
    } catch (e) {
      console.error('[Google Fit API] Token refresh failed:', e);
      return NextResponse.json({ error: 'Failed to refresh Google Fit token. Please reconnect.' }, { status: 401 });
    }

    // Define the time range (last 24 hours)
    const endTime = Date.now();
    const startTime = endTime - (24 * 60 * 60 * 1000);

    const requestBody = {
      aggregateBy: [
        { dataTypeName: 'com.google.step_count.delta' },
        { dataTypeName: 'com.google.heart_rate.bpm' },
        { dataTypeName: 'com.google.calories.expended' }
      ],
      bucketByTime: { durationMillis: 86400000 }, // 1 day bucket
      startTimeMillis: startTime,
      endTimeMillis: endTime
    };

    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Google Fit API] Error fetching data:', errorText);
      return NextResponse.json({ error: 'Failed to fetch data from Google Fit' }, { status: response.status });
    }

    const data = await response.json();
    
    // Parse the aggregated data
    let totalSteps = 0;
    let avgHeartRate = 0;
    let totalCalories = 0;

    if (data.bucket && data.bucket.length > 0) {
      const bucket = data.bucket[0];
      
      // Parse datasets
      bucket.dataset.forEach(ds => {
        if (ds.point && ds.point.length > 0) {
          const val = ds.point[0].value[0];
          
          if (ds.dataSourceId.includes('step_count')) {
            totalSteps = val.intVal || 0;
          }
          if (ds.dataSourceId.includes('heart_rate')) {
            avgHeartRate = Math.round(val.fpVal || 0);
          }
          if (ds.dataSourceId.includes('calories')) {
            totalCalories = Math.round(val.fpVal || 0);
          }
        }
      });
    }

    // Save to MongoDB
    await dbConnect();
    
    // Upsert the data for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    await WatchData.findOneAndUpdate(
      { 
        userId: subject, 
        createdAt: { $gte: startOfDay }
      },
      {
        userId: subject,
        deviceId: 'Google Fit',
        steps: totalSteps,
        heartRate: avgHeartRate || undefined, // Only update if > 0
        caloriesActive: totalCalories,
        // Ensure we don't overwrite the date if it's an update
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true, new: true }
    );

    // Return in the unified format our dashboard expects
    return NextResponse.json({
      success: true,
      data: [{
        sourceOS: 'google_fit_cloud',
        metrics: {
          totalSteps,
          avgHeartRate,
          caloriesActive: totalCalories
        }
      }]
    });

  } catch (error) {
    console.error('[Google Fit API] Exception:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
