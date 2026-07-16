import { useState, useEffect } from 'react';

export default function UserInfoForm() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    language: 'en',
    bloodGroup: 'A+',
    weight: 70,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadUser = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      if (data.user) setUser(data.user);
      else setMessage('User not found');
    } catch (e) {
      console.error(e);
      setMessage('Error loading user');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return setMessage('Please provide User ID');
    setLoading(true);
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.user) setMessage('User updated successfully');
      else setMessage('Update failed');
    } catch (e) {
      console.error(e);
      setMessage('Error updating user');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h2>User Information</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          User ID (MongoDB _id):
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
        </label>
        <button onClick={loadUser} disabled={loading} style={{ marginTop: '0.5rem' }}>
          Load User
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {Object.keys(user).map((key) => (
          <div key={key} style={{ marginBottom: '0.8rem' }}>
            <label>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
              <input
                type={key === 'weight' ? 'number' : 'text'}
                name={key}
                value={user[key] ?? ''}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }}
              />
            </label>
          </div>
        ))}
        <button type="submit" disabled={loading} style={{ padding: '0.6rem 1.2rem' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
