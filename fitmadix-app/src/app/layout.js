import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { LanguageProvider } from '@/components/LanguageContext';
import { BluetoothProvider } from '@/components/BluetoothContext';

import PushNotificationManager from '@/components/PushNotificationManager';

export const metadata = {
  title: 'Fitmadix - Your Health, Our Priority',
  description: 'Complete medical app with AI guide, medicines, diseases, diets, and exercises.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
