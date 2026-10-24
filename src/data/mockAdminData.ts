import { AdminMetrics, Transaction, UserProfile } from '../types';

export const INITIAL_ADMIN_METRICS: AdminMetrics = {
  totalUsers: 14820,
  activeSubscribers: 9140,
  monthlyRecurringRevenuePhp: 1425800,
  yearlyProjectedPhp: 17109600,
  churnRatePercent: 1.5,
  conversionRatePercent: 21.4,
  tierBreakdown: {
    start: 5680,
    growth: 3240,
    ready: 2890,
    specialist: 1850,
    scholar: 1160
  },
  paymentMethodBreakdown: {
    gcash: 4850,
    maya: 2410,
    card: 1120,
    bank_dragonpay: 420,
    otc_dragonpay: 210,
    paypal: 130
  }
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-901',
    date: '2026-10-23 15:42',
    userName: 'Krizzia Anne Santos',
    userEmail: 'krizzia.santos@gmail.com',
    tierId: 'scholar',
    tierName: 'Nurse Scholar (All Access)',
    amountPhp: 499,
    paymentMethod: 'gcash',
    status: 'completed',
    payoutStatus: 'settled',
    payoutDestination: 'GCash 0917-***-8821 (Owner Main)',
    referenceNumber: 'GC-20261023-88192'
  },
  {
    id: 'tx-902',
    date: '2026-10-23 14:18',
    userName: 'Bryan Joshua Reyes',
    userEmail: 'bryan.reyes@yahoo.com',
    tierId: 'specialist',
    tierName: 'Nurse Specialist',
    amountPhp: 349,
    paymentMethod: 'maya',
    status: 'completed',
    payoutStatus: 'settled',
    payoutDestination: 'Maya 0928-***-4412 (Owner Vault)',
    referenceNumber: 'MY-20261023-99321'
  },
  {
    id: 'tx-903',
    date: '2026-10-23 12:05',
    userName: 'Christine Joy Mercado',
    userEmail: 'cjm.nurse@outlook.com',
    tierId: 'ready',
    tierName: 'Nurse Ready',
    amountPhp: 199,
    paymentMethod: 'card',
    status: 'completed',
    payoutStatus: 'settled',
    payoutDestination: 'BDO Unibank Acct ****4920',
    referenceNumber: 'STRIPE-CH-8823190'
  },
  {
    id: 'tx-904',
    date: '2026-10-23 10:30',
    userName: 'Mark Anthony David',
    userEmail: 'mark.david@gmail.com',
    tierId: 'growth',
    tierName: 'Nurse Growth',
    amountPhp: 99,
    paymentMethod: 'bank_dragonpay',
    status: 'completed',
    payoutStatus: 'processing',
    payoutDestination: 'BPI Checking Acct ****1108',
    referenceNumber: 'DP-BPI-55102'
  },
  {
    id: 'tx-905',
    date: '2026-10-23 09:15',
    userName: 'Dr. Evelyn Tan-Sy, PhD',
    userEmail: 'evelyn.tansy@ust.edu.ph',
    tierId: 'scholar',
    tierName: 'Nurse Scholar Annual',
    amountPhp: 5148, // 429 * 12
    paymentMethod: 'paypal',
    status: 'completed',
    payoutStatus: 'settled',
    payoutDestination: 'PayPal (rjsha0420@gmail.com)',
    referenceNumber: 'PP-INV-9938120'
  }
];

export const MOCK_USER_DIRECTORY: UserProfile[] = [
  {
    id: 'user-001',
    name: 'Rjsha Admin (Owner)',
    email: 'rjsha0420@gmail.com',
    role: 'admin',
    tier: 'scholar',
    billingCycle: 'annual',
    subscriptionExpiresAt: '2030-12-31',
    schoolOrHospital: 'Global Health & Nursing Leadership Institute',
    targetExam: 'All Standards',
    targetCountry: 'Worldwide',
    specialtyInterest: 'Executive Nursing & Research',
    clinicalHoursCompleted: 4200,
    cpdUnitsCompleted: 120,
    pnleReadinessScore: 99,
    savedDecksCount: 42
  },
  {
    id: 'user-002',
    name: 'Patricia Nicole Ramos',
    email: 'patricia.ramos@up.edu.ph',
    role: 'undergrad',
    tier: 'growth',
    billingCycle: 'monthly',
    subscriptionExpiresAt: '2026-11-23',
    schoolOrHospital: 'University of the Philippines Manila (UPCN)',
    targetExam: 'PNLE',
    targetCountry: 'Philippines',
    specialtyInterest: 'Community Health',
    clinicalHoursCompleted: 1650,
    cpdUnitsCompleted: 0,
    pnleReadinessScore: 84,
    savedDecksCount: 8
  },
  {
    id: 'user-003',
    name: 'Christian Dave Lim, RN',
    email: 'cd.lim.rn@gmail.com',
    role: 'rn',
    tier: 'specialist',
    billingCycle: 'annual',
    subscriptionExpiresAt: '2027-04-12',
    schoolOrHospital: 'Philippine General Hospital (PGH)',
    targetExam: 'NCLEX-RN & CCRN',
    targetCountry: 'USA',
    specialtyInterest: 'Cardiovascular ICU',
    clinicalHoursCompleted: 3400,
    cpdUnitsCompleted: 35,
    pnleReadinessScore: 92,
    savedDecksCount: 19
  },
  {
    id: 'user-004',
    name: 'Prof. Rowena Del Rosario, MSN, RN',
    email: 'rdelrosario@dlshsi.edu.ph',
    role: 'phd',
    tier: 'scholar',
    billingCycle: 'annual',
    subscriptionExpiresAt: '2027-08-30',
    schoolOrHospital: 'De La Salle Medical and Health Sciences Institute',
    targetExam: 'PhD Comprehensive & DScN',
    targetCountry: 'Philippines & USA',
    specialtyInterest: 'Maternal-Newborn & Informatics',
    clinicalHoursCompleted: 5800,
    cpdUnitsCompleted: 75,
    pnleReadinessScore: 98,
    savedDecksCount: 31
  }
];

export interface PaymentGatewayConfig {
  payMongoSecretKey: string;
  payMongoPublicKey: string;
  dragonpayMerchantId: string;
  dragonpaySecretPassword: string;
  paypalClientId: string;
  stripeSecretKey: string;
  payoutDefaultMethod: 'gcash' | 'maya' | 'bdo' | 'bpi' | 'paypal';
  ownerGcashNumber: string;
  ownerMayaNumber: string;
  ownerBdoAccount: string;
  ownerBpiAccount: string;
  ownerPaypalEmail: string;
  autoPayoutSchedule: 'daily' | 'weekly' | 'instant';
  liveModeEnabled: boolean;
}

export const INITIAL_PAYMENT_CONFIG: PaymentGatewayConfig = {
  payMongoSecretKey: 'sk_live_nursepath_098234821',
  payMongoPublicKey: 'pk_live_nursepath_102938475',
  dragonpayMerchantId: 'NURSEPATH_PH',
  dragonpaySecretPassword: '••••••••••••••••',
  paypalClientId: 'client_nursepath_live_9941',
  stripeSecretKey: 'sk_live_51Pnursepath...',
  payoutDefaultMethod: 'gcash',
  ownerGcashNumber: '0917-892-4200',
  ownerMayaNumber: '0918-552-4200',
  ownerBdoAccount: '0064-2819-4920 (BDO Current)',
  ownerBpiAccount: '4410-9281-1108 (BPI Preferred)',
  ownerPaypalEmail: 'rjsha0420@gmail.com',
  autoPayoutSchedule: 'daily',
  liveModeEnabled: true
};
