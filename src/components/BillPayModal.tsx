import React, { useState } from 'react';
import { useBank } from '../context/BankContext';

interface BillPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BillPayModal: React.FC<BillPayModalProps> = ({ isOpen, onClose }) => {
  const { bills, accounts, payBill, formatMoney } = useBank();
  const [selectedBillId, setSelectedBillId] = useState<string>('');
  const [selectedAccId, setSelectedAccId] = useState<string>(accounts[0]?.id || '');
  const [statusMsg, setStatusMsg] = useState<string>('');

  if (!isOpen) return null;

  const dueBills = bills.filter((b) => b.status === 'due' || b.status === 'overdue');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillId || !selectedAccId) return;
    const res = payBill(selectedBillId, selectedAccId);
    if (res.success) {
      setStatusMsg('Bill paid successfully!');
      setTimeout(() => {
        setStatusMsg('');
        onClose();
      }, 1200);
    } else {
      setStatusMsg(res.error || 'Failed to pay bill');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold">Scheduled Bills & Auto-Debits</h3>
          <button onClick={onClose} className="w-8 h-8 rounded bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
        </div>
        {statusMsg && <div className="p-3 my-3 text-xs bg-slate-800 rounded text-center">{statusMsg}</div>}
        <form onSubmit={handlePay} className="py-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Select Bill</label>
            <select
              value={selectedBillId}
              onChange={(e) => setSelectedBillId(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
            >
              <option value="">Select a bill...</option>
              {dueBills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.billerName} ({b.billerAccountRef}) - {formatMoney(b.amount)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Pay From Account</label>
            <select
              value={selectedAccId}
              onChange={(e) => setSelectedAccId(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({formatMoney(a.balance)})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={!selectedBillId} className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-white border border-slate-700">
            Pay Selected Bill
          </button>
        </form>
      </div>
    </div>
  );
};
