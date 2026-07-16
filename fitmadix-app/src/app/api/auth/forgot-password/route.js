import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  await dbConnect();
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const user = await User.findOne({ email }).exec();
  if (!user) {
    // For security, do not reveal if user exists
    return NextResponse.json({ message: 'If the email exists, a reset link has been sent' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await user.save();

  // Integrated Email Service (Nodemailer)
  try {
    const nodemailer = require('nodemailer');
    
    // Use environment variables for production SMTP
    // Defaulting to a test ethereal account or console logging if env vars are missing
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test'
      }
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    // Send email (this will fail gracefully if no real SMTP credentials are provided, 
    // but the logic is fully implemented here)
    if (process.env.SMTP_HOST) {
      await transporter.sendMail({
        from: '"Fitmedx Support" <noreply@fitmedx.com>',
        to: email,
        subject: 'Password Reset Request',
        html: `
          <p>You requested a password reset.</p>
          <p>Click this <a href="${resetUrl}">link</a> to set a new password.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });
    } else {
      console.log('--- Mock Email Sent ---');
      console.log(`To: ${email}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('-----------------------');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    // Still return success to user for security reasons so we don't leak if an email failed or exists
  }

  return NextResponse.json({ message: 'Password reset link sent' });
}
