import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, dob, gender, height, weight } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    // Check if user already exists
    const existing = await User.findOne({ email }).exec();
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashed,
      dob,
      gender,
      height,
      weight,
    });
    await newUser.save();
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
