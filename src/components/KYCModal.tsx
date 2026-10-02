import React from 'react';
import { useBank } from '../context/BankContext';
import { CheckCircle2, ShieldCheck, User, Fingerprint, CreditCard } from 'lucide-react';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useBank();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Periodic Re-KYC Status</h3>
              <p className="text-xs text-emerald-700 font-semibold">100% Compliant & Active</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* KYC Badges */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            RBI Compliant Full e-KYC
          </p>
          <p className="text-emerald-700">
            No further KYC action is required at this time. Your account validity is active until October 2028.
          </p>
        </div>

        {/* Identification List */}
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Customer Full Name</span>
            </div>
            <span className="font-bold text-slate-900">{profile.name}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Permanent Account No (PAN)</span>
            </div>
            <span className="font-mono font-bold text-slate-900">{profile.panNumber || 'ABCDE1234F'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-4 h-4 text-slate-500" />
              <span className="font-medium">UIDAI Aadhaar Verification</span>
            </div>
            <span className="font-mono text-emerald-700 font-bold">Biometric Verified</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Customer CIF Number</span>
            </div>
            <span className="font-mono font-bold text-slate-900">{profile.cifNumber || '594830219'}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#E6390A] hover:bg-[#D73516] text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Close KYC Details
        </button>
      </div>
    </div>
  );
};
