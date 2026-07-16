import { NextResponse } from 'next/server';
import webpush from 'web-push';
import dbConnect from "@/lib/db";
import Medicine from "@/models/Medicine";
import PushSubscription from "@/models/PushSubscription";

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:support@fitmedx.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function GET(req) {
  try {
    // In production, we'd want a secure token or header to prevent random pings
    // For local dev, we just let it run.
    
    await dbConnect();
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Give a 15-minute window for "due" medicines
    const timeRegex = new RegExp(`^${String(currentHour).padStart(2, '0')}:`); // E.g., /^14:/

    // Find medicines that have a time scheduled in the current hour
    // (This is a simplified cron check for demonstration purposes)
    const dueMedicines = await Medicine.find({
      schedule: { $elemMatch: { time: timeRegex } }
    });

    if (dueMedicines.length === 0) {
      return NextResponse.json({ success: true, message: 'No medicines due right now' });
    }

    let notificationsSent = 0;

    for (const med of dueMedicines) {
      // Find the user's push subscriptions
      const subscriptions = await PushSubscription.find({ userId: med.userId });
      
      if (subscriptions.length > 0) {
        const payload = JSON.stringify({
          title: "Medicine Reminder",
          body: `It's time to take your ${med.name} (${med.dosage}).`,
          icon: '/favicon.ico' // Or a pill icon
        });

        for (const sub of subscriptions) {
          try {
            const pushSub = {
              endpoint: sub.endpoint,
              keys: sub.keys
            };
            await webpush.sendNotification(pushSub, payload);
            notificationsSent++;
          } catch (e) {
            console.error('[Web Push Cron] Error sending to subscription:', e.statusCode, e.body);
            if (e.statusCode === 410) {
              // Gone (unsubscribed) -> Delete it from DB
              await PushSubscription.findByIdAndDelete(sub._id);
            }
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      medicinesDue: dueMedicines.length,
      notificationsSent 
    });

  } catch (err) {
    console.error('[Web Push Cron] Internal Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
