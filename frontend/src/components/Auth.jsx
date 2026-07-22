import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';
import toast from 'react-hot-toast';
import { ArrowRight, UserPlus, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const { login, register } = useApp();
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'Super Admin' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    if (isLoginView) {
      const success = login(formData.username, formData.password);
      if (!success) {
        setError('Invalid username or password.');
      }
    } else {
      const registeredUser = await register(formData.username, formData.password, formData.role || 'Super Admin');
      if (!registeredUser) {
        setError('Username already exists. Please choose another.');
      } else {
        // Autofill registered credentials, switch to login view, and show success toast
        setIsLoginView(true);
        setError('');
        toast.success(`Registered successfully! Credentials pre-filled for ${registeredUser.username}`);
      }
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setFormData({ username: '', password: '', role: 'Super Admin' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans text-white-force">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center mb-4">
            <img src={logo} alt="Springs Academy" className="h-20 object-contain" />
          </div>
        </div>

        <div className="bg-white border border-slate-800 rounded-2xl shadow-xl p-8 text-slate-500">
          <h2 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-2">
            {isLoginView ? (
              <><LogIn className="w-5 h-5 text-blue-600" /> Sign In to your account</>
            ) : (
              <><UserPlus className="w-5 h-5 text-blue-600" /> Register new account</>
            )}
          </h2>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-400 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5 text-sm">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder={isLoginView ? "Enter your username" : "Choose a username"}
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1.5 text-sm">Password</label>
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

            {!isLoginView && (
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
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 mt-4 cursor-pointer"
            >
              {isLoginView ? 'Access Console' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-400">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleView}
                className="ml-2 text-blue-600 font-semibold hover:text-blue-500 transition-colors cursor-pointer"
              >
                {isLoginView ? 'Register here' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
