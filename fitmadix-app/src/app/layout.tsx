import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import AuthProvider from '@/components/AuthProvider';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { LanguageProvider } from '@/components/LanguageContext';
import { BluetoothProvider } from '@/components/BluetoothContext';
import PushNotificationManager from '@/components/PushNotificationManager';

// Optimize fonts using next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Fitmadix - Enterprise Medical Health Platform',
  description: 'A comprehensive, clinical-grade medical application featuring AI guidance, chronotherapy, and personalized health tracking.',
  openGraph: {
    title: 'Fitmadix - Enterprise Medical Health Platform',
    description: 'A comprehensive, clinical-grade medical application featuring AI guidance, chronotherapy, and personalized health tracking.',
    url: 'https://fitmadix-app.vercel.app',
    siteName: 'Fitmadix',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitmadix - Enterprise Medical Health Platform',
    description: 'A comprehensive, clinical-grade medical application featuring AI guidance, chronotherapy, and personalized health tracking.',
    images: ['/logo.jpeg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased font-sans bg-gray-50 text-gray-900">
        <AuthProvider>
          <LanguageProvider>
            <BluetoothProvider>
              <ResponsiveLayout>
                {children}
                <PushNotificationManager />
              </ResponsiveLayout>
            </BluetoothProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
