'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const { data: session } = useSession();
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window !== 'undefined') {
      return 'serviceWorker' in navigator && 'PushManager' in window;
    }
    return false;
  });
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }

  useEffect(() => {
    if (isSupported) {
      setTimeout(() => registerServiceWorker(), 0);
    }
  }, [isSupported]);

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      setSubscription(sub);

      // Send to server
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sub),
      });

      if (response.ok) {
        setMessage('Successfully enabled notifications!');
      } else {
        setMessage('Failed to save subscription on server.');
      }
    } catch (error) {
      if (Notification.permission === 'denied') {
        setMessage('Permission for notifications was denied.');
      } else {
        console.error('Failed to subscribe to push notifications:', error);
        setMessage('Failed to subscribe to push notifications.');
      }
    }
  }

  if (!isSupported || !session) {
    return null; // Don't render if not supported or not logged in
  }

  if (subscription) {
    return null; // Already subscribed, hide the banner
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-light)',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px' }}>
        🔔 Enable Reminders
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Get push notifications when it&apos;s time to take your medicine.
      </p>
      {message ? (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{message}</div>
      ) : (
        <button
          onClick={subscribeToPush}
          style={{
            background: 'var(--primary-teal, #10B981)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Allow Notifications
        </button>
      )}
    </div>
  );
}
