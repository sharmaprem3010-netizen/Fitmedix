import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
  }
  await dbConnect();
  const notifications = await Notification.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();
  return new Response(JSON.stringify({ notifications }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
  }
  const { message } = await request.json();
  await dbConnect();
  const newNotif = await Notification.create({ userId: session.user.id, message });
  return new Response(JSON.stringify({ notification: newNotif }), { status: 201, headers: { 'Content-Type': 'application/json' } });
}
