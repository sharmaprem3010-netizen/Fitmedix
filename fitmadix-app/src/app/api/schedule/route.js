import dbConnect from '@/lib/db';
import Schedule from '@/models/Schedule';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return new Response(JSON.stringify({ error: 'Date is required' }), { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Optional: filter by userId if implemented, otherwise just fetch by date
    const query = { date };
    if (userId) query.userId = userId;

    const schedules = await Schedule.find(query).sort({ time: 1 });
    
    return new Response(JSON.stringify({ schedules }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      data.userId = session.user.id;
    }

    const schedule = await Schedule.create(data);
    
    return new Response(JSON.stringify({ success: true, schedule }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const query = { _id: id };
    if (session?.user?.id) query.userId = session.user.id;

    const result = await Schedule.findOneAndDelete(query);
    if (!result) {
      return new Response(JSON.stringify({ error: 'Not found or unauthorized' }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
