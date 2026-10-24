import React from 'react';
import { X, Check, BookOpen, Award, Stethoscope, GraduationCap, Crown, UserCheck } from 'lucide-react';
import { UserProfile, UserRole, ZoneId } from '../types';
import { saveCurrentUser } from '../services/storageService';

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  onZoneSelected: (zone: ZoneId) => void;
}

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onZoneSelected
}) => {
  if (!isOpen) return null;

  const roles: {
    role: UserRole;
    title: string;
    description: string;
    targetZone: ZoneId;
    icon: any;
    color: string;
  }[] = [
    {
      role: 'undergrad',
      title: 'Undergraduate Student (Year 1 - 4)',
      description: 'CHED CMO 15 s.2017 4-year curriculum, clinical hours tracker, competency checklist, foundational nursing.',
      targetZone: 'undergraduate',
      icon: BookOpen,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      role: 'newgrad',
      title: 'New Graduate (Board Reviewee)',
      description: 'High-yield PNLE reviewer, 5 board subjects, daily 100-item drill, simulated readiness score.',
      targetZone: 'undergraduate',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      role: 'rn',
      title: 'Licensed Staff Nurse (RN)',
      description: '10 specialty certification reviews, hospital clinical tools (Drug guide, ABG, Calculators), CPD units, NCLEX & UK NMC prep.',
      targetZone: 'practitioner',
      icon: Stethoscope,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      role: 'masteral',
      title: 'Masteral Student / Scholar (MSN)',
      description: 'CHED CMO 5 s.2024 graduate curriculum, advanced clinical specialties, thesis proposal builder, PQF Level 7.',
      targetZone: 'graduate',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      role: 'phd',
      title: 'Doctoral Candidate (PhD / DScN / DNP)',
      description: 'PQF Level 8 terminal competencies, dissertation companion, qualifying exam prep, global research fellowships.',
      targetZone: 'graduate',
      icon: GraduationCap,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      role: 'faculty',
      title: 'Nursing Faculty & Academic Leader',
      description: 'Curriculum oversight, accreditation compliance, research mentoring, global scholarships.',
      targetZone: 'graduate',
      icon: UserCheck,
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      role: 'admin',
      title: 'Super Admin (Full Owner Access)',
      description: 'Total control over monetization, user accounts, revenue analytics, payout accounts, and content editor.',
      targetZone: 'admin',
      icon: Crown,
      color: 'bg-slate-900 text-amber-400 border-slate-700'
    }
  ];

  const handleSelectRole = (r: typeof roles[0]) => {
    const updated: UserProfile = {
      ...currentUser,
      role: r.role,
    };
    saveCurrentUser(updated);
    onUserUpdated(updated);
    onZoneSelected(r.targetZone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Switch Career Role</h3>
            <p className="text-xs text-slate-500">
              Select your nursing stage. The app will customize your dashboard and active Zone.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {roles.map((item) => {
            const Icon = item.icon;
            const isSelected = currentUser.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => handleSelectRole(item)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/40'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    {isSelected && (
                      <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
