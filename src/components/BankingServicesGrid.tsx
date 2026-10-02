import React from 'react';
import {
  FileText,
  Lock,
  Landmark,
  ShieldCheck,
  UserCheck,
  Gauge,
  Receipt,
  FileCheck,
} from 'lucide-react';

interface BankingServicesGridProps {
  onSelectAction: (actionKey: string) => void;
}

export const BankingServicesGrid: React.FC<BankingServicesGridProps> = ({
  onSelectAction,
}) => {
  const services = [
    {
      id: 'statements',
      title: 'e-Statements & Ledger',
      description: 'Official verified statements',
      icon: FileText,
      badge: 'PDF/CSV',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'fds',
      title: 'Fixed Deposits (2)',
      description: 'Tax-Saver 80C & High Yield',
      icon: Lock,
      badge: '7.90% p.a.',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      iconBg: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'loans',
      title: 'Active Loans (3)',
      description: 'Home, EV Car & Education',
      icon: Landmark,
      badge: 'EMIs Active',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      iconBg: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'tax_cert',
      title: 'Tax Certificates',
      description: 'Sec 80C, 24(b) & 80E',
      icon: FileCheck,
      badge: 'ITR Filing',
      badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
      iconBg: 'bg-orange-50 text-[#E6390A]',
    },
    {
      id: 'kyc_update',
      title: 'e-KYC & PAN Details',
      description: 'Aadhaar Biometric linked',
      icon: UserCheck,
      badge: 'Verified',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'credit_score',
      title: 'CIBIL Credit Health',
      description: 'TransUnion Score 785',
      icon: Gauge,
      badge: 'Free',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'dicgc',
      title: 'DICGC Insurance',
      description: 'Insured up to ₹5,00,000',
      icon: ShieldCheck,
      badge: 'RBI Cover',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'passbook',
      title: 'UPI & NACH Passbook',
      description: 'Real-time auto-debit log',
      icon: Receipt,
      badge: 'Live',
      badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
      iconBg: 'bg-orange-50 text-[#E6390A]',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          What's trending & Services
        </h3>
        <span className="text-xs text-[#E6390A] font-semibold">Balance & Statement Hub</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              onClick={() => onSelectAction(s.id)}
              className="p-4 rounded-2xl bg-white border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group space-y-2.5 flex flex-col justify-between shadow-2xs active:scale-98"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className={`p-2.5 rounded-xl ${s.iconBg} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${s.badgeColor}`}
                >
                  {s.badge}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#E6390A] transition-colors">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
