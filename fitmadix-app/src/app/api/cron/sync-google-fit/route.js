import dbConnect from '@/lib/db';
import OAuthCredential from '@/models/OAuthCredential';
import WatchData from '@/models/WatchData';
import { getFreshAccessToken } from '@/lib/secureTokenStore';

export async function GET(req) {
  // Optional: Add cron secret check for Vercel
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  try {
    await dbConnect();
    const credentials = await OAuthCredential.find({ provider: 'google-fit' }).lean();

    const results = {
      total: credentials.length,
      success: 0,
      failed: 0,
    };

    const endTime = Date.now();
    const startTime = endTime - 86400000; // Last 24 hours

    for (const cred of credentials) {
      try {
        const accessToken = await getFreshAccessToken({
          provider: 'google-fit',
          subject: cred.subject,
        });

        if (!accessToken) {
          results.failed++;
          continue;
        }

        // Fetch aggregate steps and heart rate
        const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
        const body = {
          aggregateBy: [
            { dataTypeName: 'com.google.heart_rate.bpm' },
            { dataTypeName: 'com.google.step_count.delta' }
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime.toString(),
          endTimeMillis: endTime.toString(),
        };

        const fitRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        });

        if (!fitRes.ok) {
          console.error('Google Fit API error for subject', cred.subject);
          results.failed++;
          continue;
        }

        const fitData = await fitRes.json();
        
        let heartRate = 0;
        let steps = 0;

        // Parse Google Fit aggregate data
        const buckets = fitData.bucket || [];
        for (const b of buckets) {
          const datasets = b.dataset || [];
          for (const ds of datasets) {
            const pts = ds.point || [];
            for (const p of pts) {
              const v = (p.value && p.value[0]) || null;
              if (v) {
                if (v.fpVal !== undefined) heartRate = v.fpVal; // bpm usually fpVal
                else if (v.intVal !== undefined) steps = v.intVal; // steps usually intVal
              }
            }
          }
        }

        // Upsert into WatchData
        if (heartRate > 0 || steps > 0) {
           await WatchData.findOneAndUpdate(
             { userId: cred.subject },
             { 
               userId: cred.subject,
               deviceId: 'Google Fit',
               heartRate: heartRate || undefined,
               steps: steps || undefined,
               createdAt: new Date()
             },
             { upsert: true, new: true, sort: { createdAt: -1 } }
           );
        }

        results.success++;
      } catch (err) {
        console.error('Failed to sync user', cred.subject, err);
        results.failed++;
      }
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Cron Sync Error:', error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}
