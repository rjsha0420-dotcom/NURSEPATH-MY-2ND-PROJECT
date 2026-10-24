import React from 'react';
import { 
  GraduationCap, 
  Globe, 
  Stethoscope, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Award,
  Crown
} from 'lucide-react';
import { UserProfile, ZoneId, SubscriptionTierId } from '../types';

interface NavigationProps {
  user: UserProfile;
  activeZone: ZoneId;
  onSelectZone: (zone: ZoneId) => void;
  onOpenSubscription: () => void;
  onOpenRoleSwitch: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  user,
  activeZone,
  onSelectZone,
  onOpenSubscription,
  onOpenRoleSwitch
}) => {
  const isSuperAdmin = user.role === 'admin';

  const zoneItems: { id: ZoneId; label: string; icon: any; badge?: string; color: string }[] = [
    { id: 'undergraduate', label: 'Undergraduate', icon: BookOpen, badge: 'CHED Year 1-4 + PNLE', color: 'text-teal-600 bg-teal-50' },
    { id: 'international', label: 'International', icon: Globe, badge: 'NCLEX • UK NMC • AHPRA', color: 'text-cyan-600 bg-cyan-50' },
    { id: 'practitioner', label: 'Practitioner', icon: Stethoscope, badge: '10 Specialties + Clinical Tools', color: 'text-blue-600 bg-blue-50' },
    { id: 'graduate', label: 'Graduate Zone', icon: GraduationCap, badge: 'MSN & PhD / DScN', color: 'text-indigo-600 bg-indigo-50' },
    { id: 'study_lounge', label: 'Study Lounge', icon: Zap, badge: 'SM-2 AI Flashcards & Cases', color: 'text-amber-600 bg-amber-50' },
    { id: 'community', label: 'Global Network', icon: Users, badge: 'Jobs • Mentors • Grants', color: 'text-violet-600 bg-violet-50' },
    { id: 'admin', label: 'Admin Hub', icon: Crown, badge: 'Owner Controls & Revenue', color: 'text-emerald-700 bg-emerald-50' },
  ];

  const getTierDisplay = (tier: SubscriptionTierId) => {
    switch (tier) {
      case 'start': return { name: 'Nurse Start (Free)', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'growth': return { name: 'Nurse Growth ⭐', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'ready': return { name: 'Nurse Ready 🏆', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'specialist': return { name: 'Nurse Specialist 👩⚕️', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'scholar': return { name: 'Nurse Scholar 🎓 All-Access', bg: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold' };
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'undergrad': return 'Undergraduate BSN';
      case 'newgrad': return 'New Graduate (Board Taker)';
      case 'rn': return 'Registered Staff Nurse';
      case 'masteral': return 'MSN Student / Alum';
      case 'phd': return 'PhD / Doctoral Candidate';
      case 'faculty': return 'Nursing Faculty / Dean';
      case 'admin': return 'Super Admin (Owner)';
      default: return 'Nurse Scholar';
    }
  };

  const tierInfo = getTierDisplay(user.tier);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with Brand & Owner notice */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-teal-400/40">
            CHED CMO 15 s.2017 & CMO 5 s.2024 Compliant
          </span>
          <span className="hidden md:inline text-slate-300">
            Study Local. Pass Global. Practice Anywhere. Advance to the Highest Level.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-teal-400 font-medium">PQF Levels 6-8 Certified</span>
          <span className="text-slate-400">|</span>
          <button 
            onClick={onOpenRoleSwitch}
            className="hover:text-teal-300 transition-colors flex items-center space-x-1 underline cursor-pointer"
          >
            <span>Role: {getRoleDisplay(user.role)}</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-blue-700 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                NURSE<span className="text-teal-600">PATH</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 tracking-wide">
                GLOBAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              One Unified Nursing Platform • Student → Doctorate
            </p>
          </div>
        </div>

        {/* User Info & Subscription Upgrade */}
        <div className="flex items-center space-x-3">
          {/* Active Subscription Tier Badge */}
          <button
            onClick={onOpenSubscription}
            className={`px-3 py-1.5 rounded-lg border text-xs flex items-center space-x-1.5 transition-all shadow-2xs hover:shadow-sm cursor-pointer ${tierInfo.bg}`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>{tierInfo.name}</span>
          </button>

          {/* Role Switcher Button */}
          <button
            onClick={onOpenRoleSwitch}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Switch your role view (Student, RN, Masteral, PhD, Admin)"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Role View:</span>
            <span className="font-semibold text-slate-900">{getRoleDisplay(user.role)}</span>
          </button>

          {/* Quick Subscribe CTA */}
          <button
            onClick={onOpenSubscription}
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="hidden md:inline">Upgrade / Plans</span>
            <span className="md:hidden">Upgrade</span>
          </button>
        </div>
      </div>

      {/* Internal Zones Switcher Tabs */}
      <nav className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 py-1.5 min-w-max">
          {zoneItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeZone === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectZone(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <div className={`p-1 rounded-md ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full hidden lg:inline font-normal ${
                    isActive ? 'bg-slate-100 text-slate-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
