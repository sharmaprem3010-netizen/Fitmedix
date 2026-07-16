import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';


export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);

  const toggle = async () => {
    if (!open && session?.user?.email) {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (e) { console.error(e); }
    }
    setOpen(!open);
  };

  return (
    <div className="notification-wrapper" style={{ position: 'relative' }}>
      <button className="notification-btn" onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        🔔
      </button>
      {open && (
        <div className="notification-modal" style={{ position: 'absolute', right: 0, top: '2rem', width: '300px', background: 'var(--bg-card)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '1rem', zIndex: 10 }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Notifications</h4>
          {notifications.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No notifications.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {notifications.map((n) => (
                <li key={n._id} style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
