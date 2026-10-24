import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { SubscriptionModal } from './components/SubscriptionModal';
import { RoleSwitchModal } from './components/RoleSwitchModal';
import { UndergraduateZone } from './components/zones/UndergraduateZone';
import { InternationalZone } from './components/zones/InternationalZone';
import { PractitionerZone } from './components/zones/PractitionerZone';
import { GraduateZone } from './components/zones/GraduateZone';
import { StudyLoungeZone } from './components/zones/StudyLoungeZone';
import { CommunityZone } from './components/zones/CommunityZone';
import { AdminDashboard } from './components/zones/AdminDashboard';
import { UserProfile, ZoneId } from './types';
import { getCurrentUser, saveCurrentUser } from './services/storageService';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Globe, 
  Award, 
  Crown,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());
  const [activeZone, setActiveZone] = useState<ZoneId>('undergraduate');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false);

  const handleUserUpdated = (updated: UserProfile) => {
    setCurrentUser(updated);
    saveCurrentUser(updated);
  };

  const handleSelectZone = (zone: ZoneId) => {
    setActiveZone(zone);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Top Header & Zone Tabs */}
      <Navigation
        user={currentUser}
        activeZone={activeZone}
        onSelectZone={handleSelectZone}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenRoleSwitch={() => setIsRoleSwitchModalOpen(true)}
      />

      {/* Main Body with Active Zone */}
      <main className="flex-1 pb-16">
        {activeZone === 'undergraduate' && (
          <UndergraduateZone
            user={currentUser}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeZone === 'international' && (
          <InternationalZone
            user={currentUser}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeZone === 'practitioner' && (
          <PractitionerZone
            user={currentUser}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeZone === 'graduate' && (
          <GraduateZone
            user={currentUser}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeZone === 'study_lounge' && (
          <StudyLoungeZone
            user={currentUser}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeZone === 'community' && (
          <CommunityZone
            user={currentUser}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeZone === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}
      </main>

      {/* Subscription Paywall & Direct Payout Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentUser={currentUser}
        onUserUpdated={handleUserUpdated}
      />

      {/* Role Switcher Modal */}
      <RoleSwitchModal
        isOpen={isRoleSwitchModalOpen}
        onClose={() => setIsRoleSwitchModalOpen(false)}
        currentUser={currentUser}
        onUserUpdated={handleUserUpdated}
        onZoneSelected={handleSelectZone}
      />

      {/* Global Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-white tracking-tight">
                  NURSE<span className="text-teal-400">PATH</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-500/30">
                  Global Nursing Platform
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-xl">
                Study Local. Pass Global. Practice Anywhere. Advance to the Highest Level. One Journey, No Borders.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                CHED CMO 15 s.2017 & CMO 5 s.2024
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                PQF Levels 6-8 Certified
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                ICN & AACN Aligned
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 NURSEPATH. All rights reserved. 100% Owner rights, source code, and subscription revenue retained by Admin.
            </div>
            <div className="flex items-center space-x-4">
              <span>Privacy Compliant (RA 10173 & HIPAA)</span>
              <span>•</span>
              <button
                onClick={() => handleSelectZone('admin')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Super Admin Access
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
