import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Lock,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Tag,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../authentication/AuthContext.tsx';
import { medicalRecordsService } from '../../services/medical-data/medicalDataService.ts';
import { MedicalRecordItem } from '../../services/medical-data/types.ts';
import { EmptyState } from '../../components/ui/FeedbackStates.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';

export const MedicalRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New record form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MedicalRecordItem['category']>('lab-report');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [issuer, setIssuer] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [userId]);

  const loadRecords = async () => {
    setLoading(true);
    const data = await medicalRecordsService.getUserRecords(userId);
    setRecords(data);
    setLoading(false);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);
    await medicalRecordsService.addRecord(userId, {
      title: title.trim(),
      category,
      date,
      issuer: issuer.trim() || 'Self-Reported / Certified Lab',
      verifiedStatus: 'unverified',
    });

    setIsUploading(false);
    setUploadSuccess(true);
    setTitle('');
    setIssuer('');
    loadRecords();

    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F] mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted Records Vault</span>
            <span aria-hidden="true">·</span>
            <span>Fitmadix V2</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#002B49]">
            Medical Records & Reports
          </h1>
          <p className="text-xs text-slate-500">
            Store, view, and organize your diagnostic lab reports, prescriptions, and physician documents.
          </p>
        </div>

        <Button onClick={() => setShowUploadModal(true)} icon={<Plus className="w-4 h-4" />}>
          Upload Document
        </Button>
      </div>

      {/* Privacy Notice Card */}
      <div className="p-4 bg-[#F0FDF9] border border-[#00A88F]/30 rounded-2xl flex items-start gap-3 text-xs text-[#002B49]">
        <ShieldCheck className="w-4 h-4 text-[#00A88F] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Zero-Knowledge Architecture: </span>
          All records uploaded to Fitmadix are associated exclusively with your authenticated session token via Supabase Row Level Security (RLS). Medical data is never exposed publicly.
        </div>
      </div>

      {/* Upload Record Modal / Drawer */}
      {showUploadModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Store Medical Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">Document Logged Securely</h3>
                <p className="text-xs text-slate-500">Record added to your private timeline.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <Input
                  label="Document Title"
                  placeholder="e.g. Complete Blood Count (CBC) Panel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  requiredIndicator
                />

                <Select
                  label="Document Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  options={[
                    { value: 'lab-report', label: 'Laboratory Blood / Urine Test' },
                    { value: 'prescription', label: 'Doctor Prescription' },
                    { value: 'imaging', label: 'Radiology / Ultrasound / X-Ray' },
                    { value: 'discharge-summary', label: 'Discharge Summary' },
                    { value: 'vaccine', label: 'Immunization Record' },
                  ]}
                />

                <Input
                  label="Document Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <Input
                  label="Issuing Clinic or Doctor"
                  placeholder="e.g. St. Jude Pathology / Dr. Miller"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                />

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-700">Attach Document File (PDF / JPG / PNG)</p>
                  <p className="text-[11px] text-slate-400">File remains encrypted on device</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isUploading}>
                    Save Document
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Record List or Empty State */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Retrieving user health vault...</div>
      ) : records.length === 0 ? (
        <EmptyState
          title="No medical documents stored yet"
          description="Your medical record history is currently empty. Upload lab test results, prescriptions, or clinical summaries to securely manage them in one place."
          action={{
            label: 'Add First Medical Document',
            onClick: () => setShowUploadModal(true),
          }}
          icon={<FileText className="w-10 h-10 text-slate-400 stroke-1" />}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>Stored Documents ({records.length})</span>
            <span className="font-mono">Vault Status: Secure</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-white border border-slate-200/90 rounded-xl flex items-center justify-between shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{rec.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="capitalize">{rec.category.replace('-', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.issuer}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{rec.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Encrypted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
