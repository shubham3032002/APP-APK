import React from 'react';
import { Building2, MapPin, Phone } from 'lucide-react';

export const SocietyInfo: React.FC = () => (
  <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
    <div className="p-5 rounded-3xl bg-white border border-orange-100 shadow-xs space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#E6390A] flex items-center justify-center font-bold text-lg">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            रायगड जिल्हा M.U.M.V सहकारी पतसंस्था मर्यादित
          </h3>
          <p className="text-[11px] text-slate-500">Reg No: KBA/RS/139/198</p>
        </div>
      </div>

      <div className="space-y-3 text-xs text-slate-600">
        <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1">
          <span className="font-bold text-slate-900 text-xs block">Head Office &amp; Main Branch</span>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-[#E6390A] shrink-0" />
            <span>ता. पेण  जि. रायगड</span>
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <Phone className="w-3.5 h-3.5 text-[#E6390A] shrink-0" />
            <span>Helpdesk: 8698062335</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);