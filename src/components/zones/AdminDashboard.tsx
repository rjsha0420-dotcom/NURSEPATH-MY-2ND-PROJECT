import React, { useState } from 'react';
import { 
  Crown, 
  TrendingUp, 
  Users, 
  CreditCard, 
  DollarSign, 
  Settings, 
  FileText, 
  ShieldCheck, 
  Download, 
  Search, 
  Edit3, 
  Key, 
  Building, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  AdminMetrics, 
  Transaction, 
  UserProfile, 
  SubscriptionTierId, 
  PaymentMethodType 
} from '../../types';
import { 
  getAdminMetrics, 
  getTransactions, 
  getPaymentConfig, 
  savePaymentConfig 
} from '../../services/storageService';
import { MOCK_USER_DIRECTORY, PaymentGatewayConfig } from '../../data/mockAdminData';

interface AdminDashboardProps {
  currentUser: UserProfile;
  onOpenSubscription: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onOpenSubscription }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'gateways' | 'content'>('overview');
  
  const [metrics, setMetrics] = useState<AdminMetrics>(getAdminMetrics());
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions());
  const [userList, setUserList] = useState<UserProfile[]>(MOCK_USER_DIRECTORY);
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>(getPaymentConfig());
  
  const [userSearch, setUserSearch] = useState('');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  const handleSavePaymentKeys = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentConfig(paymentConfig);
    setConfigSavedNotice(true);
    setTimeout(() => setConfigSavedNotice(false), 3000);
  };

  const handleManualTierChange = (userId: string, newTier: SubscriptionTierId) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, tier: newTier } : u))
    );
  };

  const filteredUsers = userList.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Super Admin Full Ownership Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Crown className="w-3.5 h-3.5" />
                <span>Super Admin • Full 100% Owner Access</span>
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Direct Payouts Active</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              NURSEPATH Executive Control Center
            </h1>
            <p className="text-xs text-slate-300">
              Logged in as: <strong className="text-amber-300">{currentUser.name}</strong> ({currentUser.email}). You own 100% of source code, database records, and subscription revenues.
            </p>
          </div>

          <div className="text-right bg-white/5 p-4 rounded-xl border border-white/10 shrink-0">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Monthly Recurring Revenue (MRR)</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              ₱{metrics.monthlyRecurringRevenuePhp.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              ARR: ₱{metrics.yearlyProjectedPhp.toLocaleString()} (+$12.5k USD/mo)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'overview', label: '📊 Executive Analytics', badge: 'Real-Time' },
          { id: 'revenue', label: '💰 Revenue & Direct Payouts', badge: `${transactions.length} Transactions` },
          { id: 'users', label: '👥 User & Account Management', badge: `${metrics.totalUsers} Total` },
          { id: 'gateways', label: '⚙️ Payment Gateway API Keys', badge: 'GCash / Maya / Bank' },
          { id: 'content', label: '📝 Content & Question Management', badge: 'Editor' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === tab.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Executive Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Registered Nurses</span>
              <div className="text-2xl font-black text-slate-900">{metrics.totalUsers.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">+842 this week</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Paying Subscribers</span>
              <div className="text-2xl font-black text-teal-800">{metrics.activeSubscribers.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 font-semibold">Conversion: {metrics.conversionRatePercent}%</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Monthly Churn Rate</span>
              <div className="text-2xl font-black text-blue-900">{metrics.churnRatePercent}%</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Industry low (&lt;2.0%)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Annualized Run Rate (ARR)</span>
              <div className="text-2xl font-black text-amber-600">₱{metrics.yearlyProjectedPhp.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 font-semibold">100% Owner Equity</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tier Distribution Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">
                Subscription Distribution Across 5 Tiers
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Tier 1: Nurse Start (₱0)', count: metrics.tierBreakdown.start, color: 'bg-slate-400' },
                  { name: 'Tier 2: Nurse Growth (₱99/mo)', count: metrics.tierBreakdown.growth, color: 'bg-teal-500' },
                  { name: 'Tier 3: Nurse Ready (₱199/mo)', count: metrics.tierBreakdown.ready, color: 'bg-blue-600' },
                  { name: 'Tier 4: Nurse Specialist (₱349/mo)', count: metrics.tierBreakdown.specialist, color: 'bg-purple-600' },
                  { name: 'Tier 5: Nurse Scholar All-Access (₱499/mo)', count: metrics.tierBreakdown.scholar, color: 'bg-amber-500' },
                ].map((tier, idx) => {
                  const percent = Math.round((tier.count / metrics.totalUsers) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-800">{tier.name}</span>
                        <span className="font-bold text-slate-900">{tier.count.toLocaleString()} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${tier.color}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Share */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">
                Philippine Payment Methods Share
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'GCash (PayMongo / Dragonpay)', count: metrics.paymentMethodBreakdown.gcash, color: 'bg-blue-600' },
                  { name: 'Maya (PayMongo QR)', count: metrics.paymentMethodBreakdown.maya, color: 'bg-emerald-500' },
                  { name: 'Cards (Visa / Mastercard)', count: metrics.paymentMethodBreakdown.card, color: 'bg-indigo-600' },
                  { name: 'Online Bank Transfer (BDO, BPI)', count: metrics.paymentMethodBreakdown.bank_dragonpay, color: 'bg-amber-600' },
                  { name: 'Over-the-Counter (7-Eleven)', count: metrics.paymentMethodBreakdown.otc_dragonpay, color: 'bg-orange-500' },
                  { name: 'PayPal (International)', count: metrics.paymentMethodBreakdown.paypal, color: 'bg-cyan-600' },
                ].map((pm, idx) => {
                  const percent = Math.round((pm.count / metrics.activeSubscribers) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-800">{pm.name}</span>
                        <span className="font-bold text-slate-900">{pm.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${pm.color}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Revenue & Direct Payouts */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Payout Destinations Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center justify-between">
              <span>Owner Payout Routing & Verified Bank Destinations</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Settlement Schedule: Daily T+1 Auto-Sweep
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <span className="text-slate-500 font-bold uppercase block text-[10px]">Primary E-Wallet</span>
                <span className="font-black text-slate-900 text-sm">GCash: {paymentConfig.ownerGcashNumber}</span>
                <span className="text-[11px] text-emerald-600 font-semibold block">Connected & Auto-Settled</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <span className="text-slate-500 font-bold uppercase block text-[10px]">Commercial Bank</span>
                <span className="font-black text-slate-900 text-sm">BDO: {paymentConfig.ownerBdoAccount}</span>
                <span className="text-[11px] text-emerald-600 font-semibold block">Dragonpay Corporate Direct</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <span className="text-slate-500 font-bold uppercase block text-[10px]">International USD Gateway</span>
                <span className="font-black text-slate-900 text-sm">PayPal: {paymentConfig.ownerPaypalEmail}</span>
                <span className="text-[11px] text-emerald-600 font-semibold block">Instant Transfer Ready</span>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Live Transactions Log
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Reference</th>
                    <th className="p-3">Subscriber</th>
                    <th className="p-3">Plan Tier</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Gateway / Method</th>
                    <th className="p-3">Payout Destination</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{tx.referenceNumber}</td>
                      <td className="p-3">
                        <span className="font-semibold block text-slate-900">{tx.userName}</span>
                        <span className="text-[10px] text-slate-500">{tx.userEmail}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{tx.tierName}</td>
                      <td className="p-3 font-black text-teal-800 text-sm">₱{tx.amountPhp.toLocaleString()}</td>
                      <td className="p-3 uppercase font-bold text-slate-600">{tx.paymentMethod}</td>
                      <td className="p-3 text-[11px] text-slate-600">{tx.payoutDestination}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="font-extrabold text-base text-slate-900">
              Registered Accounts & Role Overrides
            </h3>
            <div className="w-full sm:w-72 flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full text-xs bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">User & Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">School / Hospital</th>
                  <th className="p-3">Target Exam</th>
                  <th className="p-3">Active Tier</th>
                  <th className="p-3 text-right">Manual Tier Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-500">{u.email}</span>
                    </td>
                    <td className="p-3 uppercase font-semibold text-slate-700">{u.role}</td>
                    <td className="p-3 text-slate-600">{u.schoolOrHospital}</td>
                    <td className="p-3 font-semibold text-teal-800">{u.targetExam}</td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-blue-200">
                        {u.tier}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={u.tier}
                        onChange={(e) => handleManualTierChange(u.id, e.target.value as SubscriptionTierId)}
                        className="p-1 rounded-lg border border-slate-300 text-xs font-bold bg-white cursor-pointer"
                      >
                        <option value="start">Nurse Start (Free)</option>
                        <option value="growth">Nurse Growth (₱99)</option>
                        <option value="ready">Nurse Ready (₱199)</option>
                        <option value="specialist">Nurse Specialist (₱349)</option>
                        <option value="scholar">Nurse Scholar (₱499)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Payment Gateway API Settings */}
      {activeTab === 'gateways' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Payment Gateway Configuration & Owner API Keys
              </h3>
              <p className="text-xs text-slate-500">
                Configure your merchant keys for PayMongo, Dragonpay, and PayPal. All subscription charges will automatically process through these accounts and credit directly to your payout vaults.
              </p>
            </div>
            {configSavedNotice && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Configuration Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSavePaymentKeys} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  PayMongo Secret Key (GCash, Maya, Cards)
                </label>
                <input
                  type="password"
                  value={paymentConfig.payMongoSecretKey}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, payMongoSecretKey: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Dragonpay Merchant ID (BDO, BPI, 7-Eleven)
                </label>
                <input
                  type="text"
                  value={paymentConfig.dragonpayMerchantId}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, dragonpayMerchantId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Owner GCash Mobile Number (Direct Payout)
                </label>
                <input
                  type="text"
                  value={paymentConfig.ownerGcashNumber}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, ownerGcashNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Owner BDO Account (Corporate Direct)
                </label>
                <input
                  type="text"
                  value={paymentConfig.ownerBdoAccount}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, ownerBdoAccount: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  PayPal Business Email
                </label>
                <input
                  type="email"
                  value={paymentConfig.ownerPaypalEmail}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, ownerPaypalEmail: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Auto-Payout Sweep Frequency
                </label>
                <select
                  value={paymentConfig.autoPayoutSchedule}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, autoPayoutSchedule: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs"
                >
                  <option value="daily">Daily T+1 (Recommended)</option>
                  <option value="weekly">Weekly Friday Sweep</option>
                  <option value="instant">Instant Real-Time Payout</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-md"
              >
                Save Payout & API Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 5: Content Management */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Content & Question Bank Management
          </h3>
          <p className="text-xs text-slate-500">
            Maintain the definitive question pool for PNLE, NextGen NCLEX, UK NMC, and Graduate Qualifying exams.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <span className="font-bold text-slate-900 block">Bank Statistics:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-sm text-teal-800">15,420</span>
                <span className="block text-[10px] text-slate-500">PNLE Items</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-sm text-blue-800">8,950</span>
                <span className="block text-[10px] text-slate-500">NextGen NCLEX</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-sm text-purple-800">3,120</span>
                <span className="block text-[10px] text-slate-500">MSN Core Items</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-sm text-amber-800">1,400</span>
                <span className="block text-[10px] text-slate-500">PhD / DScN Items</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
