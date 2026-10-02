import React from 'react';
import { QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useBank } from '../context/BankContext';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewStatement: () => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onViewStatement,
}) => {
  const { profile } = useBank();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-orange-100 text-[#E6390A] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">bob World UPI QR & Passbook</h3>
              <p className="text-xs text-slate-500">Scan QR Code / Receive via UPI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* QR Code Graphic */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-orange-50/70 to-slate-50 border border-orange-100 flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* SVG stylized QR code */}
            <svg viewBox="0 0 100 100" className="w-40 h-40 text-slate-900">
              <rect width="100" height="100" fill="white" />
              {/* Top-left corner */}
              <rect x="10" y="10" width="28" height="28" fill="#1e293b" rx="4" />
              <rect x="16" y="16" width="16" height="16" fill="white" rx="2" />
              <rect x="20" y="20" width="8" height="8" fill="#E6390A" />
              {/* Top-right corner */}
              <rect x="62" y="10" width="28" height="28" fill="#1e293b" rx="4" />
              <rect x="68" y="16" width="16" height="16" fill="white" rx="2" />
              <rect x="72" y="20" width="8" height="8" fill="#E6390A" />
              {/* Bottom-left corner */}
              <rect x="10" y="62" width="28" height="28" fill="#1e293b" rx="4" />
              <rect x="16" y="68" width="16" height="16" fill="white" rx="2" />
              <rect x="20" y="72" width="8" height="8" fill="#E6390A" />
              {/* Data blocks */}
              <rect x="44" y="14" width="12" height="6" fill="#1e293b" />
              <rect x="44" y="26" width="6" height="12" fill="#1e293b" />
              <rect x="14" y="44" width="12" height="6" fill="#1e293b" />
              <rect x="28" y="44" width="16" height="12" fill="#1e293b" />
              <rect x="50" y="44" width="8" height="8" fill="#1e293b" />
              <rect x="64" y="44" width="14" height="6" fill="#1e293b" />
              <rect x="82" y="44" width="8" height="14" fill="#1e293b" />
              <rect x="44" y="62" width="12" height="12" fill="#1e293b" />
              <rect x="62" y="62" width="12" height="6" fill="#1e293b" />
              <rect x="78" y="62" width="12" height="12" fill="#1e293b" />
              <rect x="62" y="74" width="8" height="14" fill="#1e293b" />
              <rect x="74" y="80" width="16" height="8" fill="#1e293b" />
              {/* Center Logo */}
              <circle cx="50" cy="50" r="10" fill="#E6390A" />
              <text x="50" y="54" fontSize="10" fontWeight="bold" textAnchor="middle" fill="white">b</text>
            </svg>
          </div>

          <div className="text-center">
            <span className="text-xs font-mono font-bold text-slate-800 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              {profile.upiId || '-'}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
            </p>
          </div>
        </div>

        {/* Action options */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onViewStatement();
            }}
            className="w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#E6390A] border border-orange-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>View UPI Passbook & Statement Ledger</span>
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>NPCI Unified Payments Interface Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
