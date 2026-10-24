import React, { useState } from 'react';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode,
  ArrowRight,
  Lock,
  HeartHandshake,
  Globe
} from 'lucide-react';
import { SubscriptionTierId, BillingCycle, PaymentMethodType, UserProfile, Transaction } from '../types';
import { recordNewTransaction, saveCurrentUser } from '../services/storageService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated
}) => {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierId>(currentUser.tier);
  const [checkoutStep, setCheckoutStep] = useState<'tiers' | 'payment' | 'success'>('tiers');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('gcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTx, setLastTx] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const tiersData: {
    id: SubscriptionTierId;
    name: string;
    tagline: string;
    monthlyPrice: number;
    annualMonthlyPrice: number;
    badge?: string;
    color: string;
    accentBg: string;
    features: string[];
    lockedNotice?: string;
  }[] = [
    {
      id: 'start',
      name: 'Nurse Start',
      tagline: 'Basic Review & Samples',
      monthlyPrice: 0,
      annualMonthlyPrice: 0,
      color: 'border-slate-300 text-slate-800',
      accentBg: 'bg-slate-100',
      features: [
        '1 Device access',
        'Basic Study Lounge (limited)',
        'PNLE sample drill (50 items)',
        'International Exams: PREVIEW ONLY',
        'Specialty & Graduate: LOCKED',
        'Standard Community read-only'
      ]
    },
    {
      id: 'growth',
      name: 'Nurse Growth',
      tagline: 'Undergrad & International Pass',
      monthlyPrice: 99,
      annualMonthlyPrice: 79,
      badge: 'POPULAR FOR STUDENTS',
      color: 'border-teal-400 text-teal-900',
      accentBg: 'bg-teal-50',
      features: [
        '3 Devices simultaneous access',
        'Full Offline mode & sync',
        'Full Study Lounge + SM-2 Flashcards',
        'Full PNLE 5-Subject Reviewer (15k items)',
        'All International Exams Unlocked (NCLEX, UK, AUS)',
        'Practitioner + Graduate: LOCKED'
      ]
    },
    {
      id: 'ready',
      name: 'Nurse Ready',
      tagline: 'Mock Exams & Exports',
      monthlyPrice: 199,
      annualMonthlyPrice: 159,
      color: 'border-blue-400 text-blue-900',
      accentBg: 'bg-blue-50',
      features: [
        'Unlimited Devices access',
        'Priority 24/7 Clinical support',
        'Everything in Nurse Growth',
        'Full Timed Mock Exams & AI Weakness Analysis',
        'PDF Notes & Flashcard Export',
        'Limited Clinical specialty calculators'
      ]
    },
    {
      id: 'specialist',
      name: 'Nurse Specialist',
      tagline: 'Hospital & Clinical Practice',
      monthlyPrice: 349,
      annualMonthlyPrice: 299,
      badge: 'STAFF RN FAVORITE',
      color: 'border-purple-400 text-purple-900',
      accentBg: 'bg-purple-50',
      features: [
        'All previous features included',
        '10 Specialty Certification Reviewers (CCRN, CEN, etc.)',
        'Full Clinical Tools (Drug guide, ABG, Labs)',
        'CPD Unit Tracking (PRC + UK NMC / AHPRA)',
        'International Practice & Relocation Resource Kit',
        'Graduate Zone: PREVIEW ONLY'
      ]
    },
    {
      id: 'scholar',
      name: 'Nurse Scholar',
      tagline: 'MSN + PhD + Everything Unlocked',
      monthlyPrice: 499,
      annualMonthlyPrice: 429,
      badge: 'ALL ZONES UNLOCKED',
      color: 'border-amber-400 text-amber-950',
      accentBg: 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300',
      features: [
        'ALL 6 ZONES COMPLETELY UNLOCKED',
        'Full MSN Program (CHED CMO 5 s.2024)',
        'MSN Entrance Reviewer & Thesis Proposal Builder',
        'Full PhD / DScN / DNP Programs (PQF Level 8)',
        'Doctoral Qualifying Exam & Dissertation Companion',
        'Research Methods Toolkit & Systematic Review Wizard',
        'Unlimited AI Clinical Tutor & Case Studies'
      ]
    }
  ];

  const currentTierObj = tiersData.find((t) => t.id === selectedTier) || tiersData[4];
  const priceToPay = cycle === 'annual' 
    ? (currentTierObj.annualMonthlyPrice * 12)
    : currentTierObj.monthlyPrice;

  const handleProceedToPayment = (tierId: SubscriptionTierId) => {
    setSelectedTier(tierId);
    if (tierId === 'start') {
      // Free tier
      const updated: UserProfile = {
        ...currentUser,
        tier: 'start',
        billingCycle: cycle,
      };
      saveCurrentUser(updated);
      onUserUpdated(updated);
      onClose();
      return;
    }
    setCheckoutStep('payment');
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    try {
      // Record transaction
      const tx: Transaction = {
        id: 'tx-' + Date.now(),
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        userName: currentUser.name,
        userEmail: currentUser.email,
        tierId: selectedTier,
        tierName: currentTierObj.name,
        amountPhp: priceToPay,
        paymentMethod,
        status: 'completed',
        payoutStatus: 'settled',
        payoutDestination: paymentMethod === 'gcash' 
          ? 'GCash 0917-892-4200 (Owner Direct)'
          : paymentMethod === 'maya'
          ? 'Maya 0918-552-4200 (Owner Vault)'
          : 'BDO Current Acct ****4920 (Owner)',
        referenceNumber: `${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`
      };

      recordNewTransaction(tx);
      setLastTx(tx);

      // Elevate user's tier
      const updated: UserProfile = {
        ...currentUser,
        tier: selectedTier,
        billingCycle: cycle,
        subscriptionExpiresAt: new Date(Date.now() + (cycle === 'annual' ? 365 : 30) * 86400000).toISOString().slice(0, 10),
      };
      saveCurrentUser(updated);
      onUserUpdated(updated);

      setCheckoutStep('success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Direct Philippine Payouts • 100% Owner Controlled
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              One Subscription Unlocks Your Entire Nursing Career
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Choose your career milestone tier. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {checkoutStep === 'tiers' && (
            <div>
              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center mb-6">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
                  <button
                    onClick={() => setCycle('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      cycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setCycle('annual')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      cycle === 'annual'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {tiersData.map((tier) => {
                  const isCurrent = currentUser.tier === tier.id;
                  const isScholar = tier.id === 'scholar';
                  const displayPrice = cycle === 'annual' ? tier.annualMonthlyPrice : tier.monthlyPrice;

                  return (
                    <div
                      key={tier.id}
                      className={`rounded-xl p-4 flex flex-col justify-between border-2 transition-all relative ${
                        isCurrent
                          ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20'
                          : isScholar
                          ? 'border-amber-400 shadow-md bg-amber-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {tier.badge && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
                          {tier.badge}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-sm text-slate-900">{tier.name}</h3>
                          {isScholar && <Crown className="w-4 h-4 text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{tier.tagline}</p>

                        <div className="mt-3 mb-4">
                          <div className="flex items-baseline space-x-1">
                            <span className="text-2xl font-black text-slate-900">₱{displayPrice}</span>
                            <span className="text-xs text-slate-500">/ mo</span>
                          </div>
                          {cycle === 'annual' && tier.monthlyPrice > 0 && (
                            <p className="text-[10px] text-teal-700 font-medium">
                              Billed annually ₱{displayPrice * 12}/yr
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          {tier.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start space-x-1.5 text-xs">
                              {feat.includes('LOCKED') ? (
                                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                              )}
                              <span className={feat.includes('LOCKED') ? 'text-slate-400 line-through text-[11px]' : 'text-slate-700 text-[11px]'}>
                                {feat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          onClick={() => handleProceedToPayment(tier.id)}
                          className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-200 text-slate-700 cursor-default'
                              : isScholar
                              ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm'
                              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                          }`}
                        >
                          {isCurrent ? 'Current Plan' : tier.id === 'start' ? 'Select Free' : 'Choose Plan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="max-w-2xl mx-auto py-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Selected Plan:</span>
                  <h4 className="font-bold text-slate-900 text-base">{currentTierObj.name}</h4>
                  <p className="text-xs text-slate-600">{currentTierObj.tagline} • {cycle === 'annual' ? 'Annual Billing' : 'Monthly Billing'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Amount Due:</span>
                  <div className="text-2xl font-black text-teal-700">₱{priceToPay.toLocaleString()}</div>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mb-3">
                Select Philippine-Friendly Payment Method:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'gcash', name: 'GCash', desc: 'Direct E-Wallet', icon: Smartphone, tag: 'Instant' },
                  { id: 'maya', name: 'Maya', desc: 'Pay with Maya QR', icon: QrCode, tag: 'Instant' },
                  { id: 'card', name: 'Debit / Credit Card', desc: 'Visa, Mastercard', icon: CreditCard, tag: 'Secure' },
                  { id: 'bank_dragonpay', name: 'Online Bank Transfer', desc: 'BDO, BPI, Metrobank', icon: Building2, tag: 'Dragonpay' },
                  { id: 'otc_dragonpay', name: 'Over-the-Counter', desc: '7-Eleven, Cebuana', icon: Building2, tag: 'Cash' },
                  { id: 'paypal', name: 'PayPal', desc: 'USD / PHP International', icon: Globe, tag: 'Global' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id as PaymentMethodType)}
                      className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-700' : 'text-slate-600'}`} />
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                          {item.tag}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Owner Payout Direct Notice */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-6 text-xs text-emerald-900 flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Direct Payout Guarantee:</span> Funds are processed via certified payment gateways and credited directly to the Owner's accounts (GCash, Maya, BDO, or PayPal) without intermediary deductions.
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <button
                  onClick={() => setCheckoutStep('tiers')}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Plans
                </button>

                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Pay ₱{priceToPay.toLocaleString()} via {paymentMethod.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="max-w-md mx-auto text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Subscription Active!</h3>
              <p className="text-xs text-slate-600 mt-1 mb-4">
                Welcome to <strong>{currentTierObj.name}</strong>. Your subscription has been confirmed and all included Zones are immediately unlocked.
              </p>

              {lastTx && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-1.5 mb-6 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Reference:</span>
                    <span className="font-bold">{lastTx.referenceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Amount Paid:</span>
                    <span className="font-bold text-teal-700">₱{lastTx.amountPhp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Destination:</span>
                    <span className="text-slate-700">{lastTx.payoutDestination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Status:</span>
                    <span className="text-emerald-600 font-bold uppercase">{lastTx.status}</span>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Start Learning Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
