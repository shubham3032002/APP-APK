import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBank } from '../context/BankContext';
import logo from '../../assets/images/logo.jpeg';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, isAuthLoading } = useBank();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = isAuthLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    const result = await login(username, password);

    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      return;
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 selection:bg-[#E6390A] selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        {/* Bank Header & Branding */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto shadow-lg shadow-orange-500/25">
            <img src={logo} alt="Society logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
           Raigad District M.U.M.V. Co-operative  Society Limited
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            रायगड जिल्हा M.U.M.V सहकारी पतसंस्था मर्यादित
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Simple Username & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={{ color: '#000000', WebkitTextFillColor: '#000000' }}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 bg-white text-black text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E6390A]/30 focus:border-[#E6390A] transition-all"
                autoComplete="username"
                autoCapitalize="none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ color: '#000000', WebkitTextFillColor: '#000000' }}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-black text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E6390A]/30 focus:border-[#E6390A] transition-all tracking-wider"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#E6390A] focus:ring-[#E6390A]" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Please contact branch manager or reset password at +91 22 2430 8920.')}
              className="text-[#E6390A] font-semibold hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#E6390A] hover:bg-[#cf3207] text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Login to Bank</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bank Security Footer Note */}
        {/* <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure 256-bit SSL Banking Portal</span>
        </div> */}
      </div>
    </div>
  );
};
