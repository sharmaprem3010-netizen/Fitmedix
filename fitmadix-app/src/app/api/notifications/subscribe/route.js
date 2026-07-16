import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import PushSubscription from "@/models/PushSubscription";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    const body = await req.json();

    if (!body || !body.endpoint || !body.keys) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    await dbConnect();

    // Upsert the subscription (one subscription per endpoint)
    await PushSubscription.findOneAndUpdate(
      { endpoint: body.endpoint },
      { 
        userId,
        endpoint: body.endpoint,
        keys: body.keys,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Web Push Subscribe] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
