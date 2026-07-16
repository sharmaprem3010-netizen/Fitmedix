import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setOpen(true);
    } catch (e) {
      console.error('Search error', e);
    }
  };

  const close = () => {
    setOpen(false);
    setResults(null);
    setQuery('');
  };

  return (
    <div className="search-bar-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
      />
      <button onClick={handleSearch} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
        Search
      </button>
      {open && results && (
        <div className="search-modal" style={{ position: 'absolute', top: '3rem', right: 0, width: '350px', background: 'var(--bg-card)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '1rem', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0 }}>Search Results</h4>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✖️</button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {Object.entries(results).map(([type, items]) => (
              <div key={type} style={{ marginBottom: '0.5rem' }}>
                <strong style={{ textTransform: 'capitalize' }}>{type}</strong>
                {items.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No {type} found.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((it) => (
                      <li key={it._id} style={{ padding: '0.2rem 0' }}>{it.name || it.title || it.generic || ''}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
