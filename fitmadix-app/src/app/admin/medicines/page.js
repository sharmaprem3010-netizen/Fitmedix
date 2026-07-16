'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol 500mg", generic: "Acetaminophen", visible: true },
    { id: 2, name: "Amoxicillin 250mg", generic: "Amoxicillin Trihydrate", visible: true },
    { id: 3, name: "Metformin 500mg", generic: "Metformin Hydrochloride", visible: false },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(m => m.id !== id));
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const toggleVisibility = (id) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, visible: !m.visible } : m));
  };

  return (
    <div className="admin-layout">
      {/* Header */}
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/admin" style={{ color: 'white' }}>←</Link>
          <h1>Manage Medicines</h1>
        </div>
        <button 
          onClick={handleAdd}
          style={{ background: 'white', color: 'var(--primary-dark)', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
        >
          + Add New
        </button>
      </div>

      <div className="admin-body">
        {medicines.map(med => (
          <div key={med.id} className="admin-card" style={{ opacity: med.visible ? 1 : 0.6 }}>
            <div className="admin-card-actions">
              <button className="admin-btn-edit" onClick={() => toggleVisibility(med.id)} title="Toggle Visibility">
                {med.visible ? '👁️' : '🙈'}
              </button>
              <button className="admin-btn-edit" onClick={() => handleEdit(med.id)}>✏️</button>
              <button className="admin-btn-delete" onClick={() => handleDelete(med.id)}>🗑️</button>
            </div>
            
            <div style={{ paddingRight: '100px' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{med.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{med.generic}</div>
              {!med.visible && <div style={{ fontSize: '0.7rem', color: '#E63946', marginTop: '6px', fontWeight: 600 }}>Hidden from users</div>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
            
            <div className="form-group">
              <label>Medicine Name</label>
              <input type="text" className="form-input" placeholder="e.g. Paracetamol 500mg" defaultValue={editingId ? medicines.find(m => m.id === editingId).name : ''} />
            </div>
            
            <div className="form-group">
              <label>Generic Name</label>
              <input type="text" className="form-input" placeholder="e.g. Acetaminophen" defaultValue={editingId ? medicines.find(m => m.id === editingId).generic : ''} />
            </div>
            
            <div className="form-group">
              <label>Usage & Dosage</label>
              <textarea className="form-input" rows="3" placeholder="Describe when and how to take this"></textarea>
            </div>

            <div className="admin-btn-row">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowModal(false)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
