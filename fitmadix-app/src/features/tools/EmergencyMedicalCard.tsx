import React, { useState } from 'react';
import { Shield, Printer, Heart, Phone, AlertTriangle, User, Download, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../authentication/AuthContext.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { FitmadixLogo } from '../../components/ui/Logo.tsx';

export const EmergencyMedicalCard: React.FC = () => {
  const { user, profile } = useAuth();

  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [donorStatus, setDonorStatus] = useState<boolean>(false);
  const [printed, setPrinted] = useState(false);

  const bloodGroup = profile?.bloodGroup && profile.bloodGroup !== 'unknown' ? profile.bloodGroup : 'Unspecified';
  const allergies = profile?.allergies && profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None logged in profile';
  const conditions = profile?.knownConditions && profile.knownConditions.length > 0 ? profile.knownConditions.join(', ') : 'None logged in profile';
  const medications = profile?.currentMedications && profile.currentMedications.length > 0 ? profile.currentMedications.join(', ') : 'None logged in profile';
  const name = profile?.fullName || user?.fullName || 'Unspecified';

  const handlePrint = () => {
    window.print();
    setPrinted(true);
    setTimeout(() => setPrinted(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F] mb-1">
            <Shield className="w-4 h-4" />
            <span>First Responder Emergency Protocol</span>
            <span aria-hidden="true">·</span>
            <span>ICE Standard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Emergency Health ID (ICE) Card
          </h2>
          <p className="text-xs text-slate-500">
            A vital summary for paramedics and emergency physicians in acute situations. Keep in your wallet or save to your phone's lock screen.
          </p>
        </div>

        <Button onClick={handlePrint} size="sm" icon={<Printer className="w-4 h-4" />}>
          Print / Save PDF
        </Button>
      </div>

      {/* The Printable Card Visual (Wallet Dimension Aspect Ratio) */}
      <div className="p-1 sm:p-2 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl shadow-xl max-w-lg mx-auto">
        <div className="bg-white rounded-xl p-5 sm:p-6 space-y-4 border border-slate-100 text-slate-900 relative overflow-hidden">
          {/* Top Brand & Emergency Strip */}
          <div className="flex items-center justify-between border-b-2 border-rose-500 pb-3">
            <div className="flex items-center gap-2">
              <FitmadixLogo variant="symbol" size="sm" />
              <div>
                <span className="text-xs font-black tracking-tight text-[#002B49] block leading-none">
                  FITMADIX
                </span>
                <span className="text-[9px] font-bold text-rose-600 tracking-wider uppercase">
                  EMERGENCY MEDICAL ID
                </span>
              </div>
            </div>

            {/* Blood Type Badge */}
            <div className="bg-rose-600 text-white px-3 py-1 rounded-lg text-center shadow-xs">
              <span className="text-[8px] uppercase tracking-wider block font-medium">Blood Group</span>
              <span className="text-sm font-black font-mono leading-none">{bloodGroup}</span>
            </div>
          </div>

          {/* Patient Core Data */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Patient Name</span>
            <div className="text-base font-black text-slate-900 tracking-tight">{name}</div>
          </div>

          {/* Critical Warnings Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100 space-y-0.5">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" /> Allergies
              </span>
              <p className="text-rose-950 font-semibold text-[11px] leading-tight">{allergies}</p>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 space-y-0.5">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Medical Conditions
              </span>
              <p className="text-amber-950 font-semibold text-[11px] leading-tight">{conditions}</p>
            </div>
          </div>

          {/* Medications & Emergency Contacts */}
          <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Medications
              </span>
              <p className="text-slate-800 font-medium text-[11px]">{medications}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#00A88F]" /> In Case of Emergency (ICE)
                </span>
                <p className="text-slate-900 font-bold text-xs">
                  {emergencyContactName || emergencyContactPhone
                    ? `${emergencyContactName || 'Contact'} ${emergencyContactPhone ? `· ${emergencyContactPhone}` : ''}`
                    : 'Not specified — enter below'}
                </p>
              </div>

              {donorStatus && (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Heart className="w-3 h-3 fill-emerald-600 text-emerald-600" /> Organ Donor
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer watermark note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
            <span>FITMADIX HEALTH ENCRYPTED ID</span>
            <span>VERIFIED ADULT STANDARD</span>
          </div>
        </div>
      </div>

      {/* Customizable Contact Inputs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Customize Emergency Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Emergency Contact Name / Relationship
            </label>
            <input
              type="text"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A88F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Emergency Contact Phone Number
            </label>
            <input
              type="tel"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A88F]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="donor"
            checked={donorStatus}
            onChange={(e) => setDonorStatus(e.target.checked)}
            className="w-4 h-4 rounded text-[#00A88F] focus:ring-[#00A88F]"
          />
          <label htmlFor="donor" className="text-xs text-slate-700 cursor-pointer">
            Include registered Organ Donor indicator on printed emergency card
          </label>
        </div>
      </div>
    </div>
  );
};
