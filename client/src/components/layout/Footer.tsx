import React from 'react';
import { Sprout, ShieldAlert, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agri-600 text-white flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">AgriAdvisor</span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Empowering farmers with AI-driven, actionable crop advisory and agronomic decision support.
              Built for precision, safety, and sustainable farming.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for resilient agriculture</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/advisory/new" className="hover:text-white transition-colors">
                  New Advisory Request
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">
                  Advisory History
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Farmer Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Agricultural Safety</h4>
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/80 text-[11px] text-stone-400 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Decision Support Notice</span>
              </div>
              <p>
                Recommendations are supplementary guides. Always inspect fields and cross-check with certified local agronomy extension officers.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} AgriAdvisor. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy & Isolation</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security Standards</span>
            <span className="hover:text-white transition-colors cursor-pointer">Agronomic Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
