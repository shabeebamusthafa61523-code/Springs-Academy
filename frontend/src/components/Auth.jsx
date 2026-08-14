import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo2 from '../assets/logo2.png';
import toast from 'react-hot-toast';
import { ArrowRight, UserPlus, LogIn, AlertCircle, Eye, EyeOff, KeyRound, Phone, CheckCircle2 } from 'lucide-react';

export default function Auth() {
  const { login, register, resetPasswordByPhone } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({ username: '', password: '', role: 'Super Admin', phoneNumber: '' });
  const [forgotData, setForgotData] = useState({ phoneNumber: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (authMode === 'forgot') {
      if (!forgotData.phoneNumber) {
        setError('Please enter your registered phone number.');
        return;
      }
      if (!forgotData.newPassword) {
        setError('Please enter a new password.');
        return;
      }
      if (forgotData.newPassword.length < 4) {
        setError('New password must be at least 4 characters long.');
        return;
      }
      if (forgotData.newPassword !== forgotData.confirmPassword) {
        setError('New password and confirm password do not match.');
        return;
      }

      toast.loading("Resetting password via phone...", { id: "reset-toast" });
      const res = await resetPasswordByPhone(forgotData.phoneNumber, forgotData.newPassword);

      if (res && res.error) {
        toast.error(res.error, { id: "reset-toast" });
        setError(res.error);
      } else {
        toast.success(`Password reset! You can now log in.`, { id: "reset-toast" });
        setFormData(prev => ({ ...prev, username: res.username || '', password: forgotData.newPassword }));
        setAuthMode('login');
        setError('');
        setSuccessMsg(`Password for ${res.username || 'your account'} has been reset successfully. Please sign in.`);
      }
      return;
    }

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    if (authMode === 'login') {
      const success = await login(formData.username, formData.password);
      if (!success) {
        setError('Invalid username or password.');
      }
    } else {
      const res = await register(formData.username, formData.password, formData.role || 'Super Admin', formData.phoneNumber);
      if (res && res.error) {
        setError(res.error);
      } else if (!res) {
        setError('Registration failed. Please choose a different username.');
      } else {
        setAuthMode('login');
        setError('');
        toast.success(`Registered successfully! Credentials pre-filled for ${res.username}`);
      }
    }
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans text-white-force">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center mb-4">
            <img src={logo2} alt="Springs Academy" className="h-20 object-contain" />
          </div>
        </div>

        <div className="bg-white border border-slate-800 rounded-2xl shadow-xl p-8 text-slate-500">
          <h2 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-2">
            {authMode === 'login' && <><LogIn className="w-5 h-5 text-blue-600" /> Sign In to your account</>}
            {authMode === 'register' && <><UserPlus className="w-5 h-5 text-blue-600" /> Register new account</>}
            {authMode === 'forgot' && <><KeyRound className="w-5 h-5 text-blue-600" /> Forgot Password (Phone)</>}
          </h2>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-400 leading-relaxed">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-6 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-600 font-semibold leading-relaxed">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {authMode === 'forgot' ? (
              <>
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5 text-sm flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-blue-600" /> Registered Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={forgotData.phoneNumber}
                    onChange={(e) => setForgotData({ ...forgotData, phoneNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder="Enter phone (e.g. 9995982324)"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1.5 text-sm">New Password *</label>
                  <input
                    type="password"
                    required
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1.5 text-sm">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={forgotData.confirmPassword}
                    onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5 text-sm">Username</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder={authMode === 'login' ? "Enter your username" : "Choose a username"}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-slate-400 font-medium text-sm">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-xs text-blue-600 hover:text-blue-500 font-semibold cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-11 py-3 text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 focus:outline-none cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1.5 text-sm flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone Number (Optional for password recovery)
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber || ''}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                        placeholder="e.g. 9995982324"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1.5 text-sm">Account Access Role *</label>
                      <select
                        value={formData.role || 'Super Admin'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-semibold cursor-pointer"
                      >
                        <option value="Super Admin">Super Admin (Full Access & HR Control)</option>
                        <option value="Admin">Admin (Admissions & Financial Ledger Console)</option>
                      </select>
                    </div>
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 mt-4 cursor-pointer"
            >
              {authMode === 'login' && 'Access Console'}
              {authMode === 'register' && 'Create Account'}
              {authMode === 'forgot' && 'Reset Password'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            {authMode === 'forgot' ? (
              <p className="text-sm text-slate-400">
                Remember your password?
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="ml-2 text-blue-600 font-semibold hover:text-blue-500 transition-colors cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </p>
            ) : (
              <p className="text-sm text-slate-400">
                {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                {/* <button
                  type="button"
                  onClick={() => switchMode(authMode === 'login' ? 'register' : 'login')}
                  className="ml-2 text-blue-600 font-semibold hover:text-blue-500 transition-colors cursor-pointer"
                >
                  {authMode === 'login' ? 'Register here' : 'Sign in instead'}
                </button> */}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
