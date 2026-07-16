'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

export default function UserInfoDashboard() {
  const { data: session } = useSession();
  
  const userName = session?.user?.name || 'Kate Prokopchuk';
  const userEmail = session?.user?.email || 'katepro@gmail.com';
  const userAvatar = session?.user?.image || 'https://i.pravatar.cc/150?img=5';

  return (
    <>
      <div className="clinik-top-actions">
        <button className="clinik-btn-outline">PRINT</button>
        <button className="clinik-btn-primary">EDIT</button>
      </div>

      <div className="clinik-grid">
        {/* Profile Card */}
        <div className="clinik-card clinik-profile-card">
          <img src={userAvatar} alt="User avatar" className="clinik-profile-avatar" />
          <div className="clinik-profile-name">{userName}</div>
          <div className="clinik-profile-contact">+38 (093) 23 45 678</div>
          <div className="clinik-profile-email">{userEmail}</div>
        </div>

        {/* General Information */}
        <div className="clinik-card">
          <div className="clinik-card-title">
            General information <span>✏️</span>
          </div>
          <div className="clinik-info-row">
            <div className="clinik-info-label">Date of birth:</div>
            <div className="clinik-info-value">23. 07. 1994</div>
          </div>
          <div className="clinik-info-row">
            <div className="clinik-info-label">Address:</div>
            <div className="clinik-info-value">Lviv, Chornovola street, 67</div>
          </div>
          <div className="clinik-info-row">
            <div className="clinik-info-label">Registration Date:</div>
            <div className="clinik-info-value">Thursday, May 25</div>
          </div>
        </div>

        {/* Anamnesis */}
        <div className="clinik-card">
          <div className="clinik-card-title">
            Anamnesis <span>✏️</span>
          </div>
          <div className="clinik-info-row">
            <div className="clinik-info-label">Allergies:</div>
            <div className="clinik-info-value">Nuts, pollen</div>
          </div>
          <div className="clinik-info-row">
            <div className="clinik-info-label">Chronic diseases:</div>
            <div className="clinik-info-value">Asthma</div>
          </div>
          <div className="clinik-info-row">
            <div className="clinik-info-label">Blood type:</div>
            <div className="clinik-info-value">1+</div>
          </div>
          <div className="clinik-info-row">
            <div className="clinik-info-label">Past illnesses or injuries:</div>
            <div className="clinik-info-value">Corona virus</div>
          </div>
        </div>
      </div>

      <div className="clinik-bottom-grid">
        {/* Visits Section */}
        <div className="clinik-card" style={{ padding: '30px' }}>
          <div className="clinik-tabs">
            <div className="clinik-tab active">Future visits (2)</div>
            <div className="clinik-tab">Past visits (15)</div>
            <div className="clinik-tab">Planned treatments</div>
          </div>
          
          <div className="clinik-visit-item purple">
            <div className="clinik-visit-col">
              <span>11.00-12.30</span>
              <strong>26 Yep 2023</strong>
            </div>
            <div className="clinik-visit-col">
              <span>Service:</span>
              <strong>Treatment and cleaning of canals</strong>
            </div>
            <div className="clinik-visit-col">
              <span>Doctor:</span>
              <strong className="clinik-visit-doctor">Oksana Ma...</strong>
            </div>
            <div className="clinik-visit-col">
              <span>Status:</span>
              <div className="clinik-status-badge" style={{ background: '#14B8A6' }}>Scheduled ⌄</div>
            </div>
          </div>

          <div className="clinik-visit-item teal">
            <div className="clinik-visit-col">
              <span>11.00-12.30</span>
              <strong>27 Nhn 2023</strong>
            </div>
            <div className="clinik-visit-col">
              <span>Service:</span>
              <strong>Teeth whitening</strong>
            </div>
            <div className="clinik-visit-col">
              <span>Doctor:</span>
              <strong className="clinik-visit-doctor">Max Oched...</strong>
            </div>
            <div className="clinik-visit-col">
              <span>Status:</span>
              <div className="clinik-status-badge" style={{ background: '#0EA5E9' }}>Scheduled ⌄</div>
            </div>
          </div>
        </div>

        {/* Files & Notes Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="clinik-card">
            <div className="clinik-card-title">
              Files
              <button className="clinik-btn-outline" style={{ padding: '4px 16px', fontSize: '0.75rem' }}>DOWNLOAD</button>
            </div>
            <div className="clinik-file-item">
              <div className="clinik-file-name">📄 Check Up Result.pdf</div>
              <div className="clinik-file-meta">123kb</div>
            </div>
            <div className="clinik-file-item">
              <div className="clinik-file-name" style={{ color: '#1DA1F2' }}>📄 Check Up Result.pdf</div>
              <div className="clinik-file-meta">
                <span style={{ cursor: 'pointer' }}>⬇️ ⊗</span>
              </div>
            </div>
            <div className="clinik-file-item">
              <div className="clinik-file-name">📄 Medical Prescriptions.pdf</div>
              <div className="clinik-file-meta">123kb</div>
            </div>
            <div className="clinik-file-item">
              <div className="clinik-file-name">📄 Check Up Result.pdf</div>
              <div className="clinik-file-meta">123kb</div>
            </div>
          </div>

          <div className="clinik-card">
            <div className="clinik-card-title">
              Notes
              <button className="clinik-btn-outline" style={{ padding: '4px 16px', fontSize: '0.75rem' }}>DOWNLOAD</button>
            </div>
            <div className="clinik-file-item">
              <div className="clinik-file-name">📄 Note 31.06.23.pdf</div>
              <div className="clinik-file-meta">123kb</div>
            </div>
            <div className="clinik-file-item">
              <div className="clinik-file-name">📄 Note 23.06.23.pdf</div>
              <div className="clinik-file-meta">123kb</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
