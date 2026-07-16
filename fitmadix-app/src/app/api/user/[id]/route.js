import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
  }
  const { id } = params;
  await dbConnect();
  const user = await User.findById(id).lean();
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }
  return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
  }
  const { id } = params;
  const updates = await request.json();
  await dbConnect();
  const updated = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
  return new Response(JSON.stringify({ user: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
