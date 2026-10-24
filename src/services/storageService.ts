import { UserProfile, Flashcard, CarePlan, CPDRecord, Transaction, AdminMetrics } from '../types';
import { MOCK_USER_DIRECTORY, INITIAL_ADMIN_METRICS, INITIAL_TRANSACTIONS, INITIAL_PAYMENT_CONFIG, PaymentGatewayConfig } from '../data/mockAdminData';
import { INITIAL_FLASHCARDS } from '../data/mockFlashcards';
import { MOCK_CPD_RECORDS } from '../data/mockClinicalTools';

const STORAGE_KEYS = {
  CURRENT_USER: 'nursepath_current_user_v1',
  FLASHCARDS: 'nursepath_flashcards_v1',
  CARE_PLANS: 'nursepath_care_plans_v1',
  CPD_RECORDS: 'nursepath_cpd_records_v1',
  ADMIN_METRICS: 'nursepath_admin_metrics_v1',
  TRANSACTIONS: 'nursepath_transactions_v1',
  PAYMENT_CONFIG: 'nursepath_payment_config_v1',
  BOOKMARKS: 'nursepath_bookmarks_v1',
  COMPLETED_QUIZZES: 'nursepath_completed_quizzes_v1',
};

// Default initial user: Undergraduate Year 4 student preparing for PNLE
export const DEFAULT_USER: UserProfile = {
  id: 'usr-student-01',
  name: 'Angelica Ramos',
  email: 'angelica.ramos@ust.edu.ph',
  role: 'undergrad',
  tier: 'scholar', // Give rich scholar access by default for evaluation, or user can toggle in paywall!
  billingCycle: 'monthly',
  subscriptionExpiresAt: '2026-12-31',
  schoolOrHospital: 'University of Santo Tomas — Faculty of Nursing',
  targetExam: 'PNLE & NCLEX-RN',
  targetCountry: 'Philippines / USA',
  specialtyInterest: 'Critical Care & Pediatrics',
  clinicalHoursCompleted: 1850,
  cpdUnitsCompleted: 15,
  pnleReadinessScore: 88,
  savedDecksCount: 6,
  isGuest: false
};

export function getCurrentUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user from storage', e);
  }
  return DEFAULT_USER;
}

export function saveCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export function getFlashcards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load flashcards', e);
  }
  return INITIAL_FLASHCARDS;
}

export function saveFlashcards(cards: Flashcard[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save flashcards', e);
  }
}

export function getCarePlans(): CarePlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARE_PLANS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load care plans', e);
  }
  return [
    {
      id: 'cp-01',
      patientProfile: '72yo Female with Congestive Heart Failure (NYHA Class III) & Bilateral Pulmonary Crackles',
      nandaDiagnosis: 'Decreased Cardiac Output related to impaired myocardial contractility',
      relatedTo: 'Altered afterload and mechanical contractility failure secondary to left ventricular dysfunction',
      asEvidencedBy: 'Ejection fraction 32%, bilateral +3 pitting pretibial edema, S3 heart sound, dyspnea on exertion, BNP 1,240 pg/mL',
      nocOutcomes: [
        'Cardiac Pump Effectiveness: SBP maintained 100-130 mmHg, HR 60-90 bpm',
        'Fluid Balance: Clear lung sounds bilaterally and reduction of peripheral edema to trace within 72h',
        'Activity Tolerance: Able to ambulate 50 meters without desaturating below 93%'
      ],
      nicInterventions: [
        { action: 'Administer IV Furosemide (Lasix) 40mg slow IV push as ordered with strict I&O and daily morning weights.', rationale: 'Reduces circulatory fluid volume and cardiac preload to relieve pulmonary capillary congestion.' },
        { action: 'Maintain client in High-Fowler position (60-90 degrees) with legs dependent.', rationale: 'Promotes diaphragmatic excursion and venous pooling in lower extremities, decreasing venous return to overloaded heart.' },
        { action: 'Monitor continuous telemetry and serum potassium daily.', rationale: 'Diuresis precipitates hypokalemia which dangerously triggers ventricular dysrhythmias and digitalis toxicity.' }
      ],
      evaluationCriteria: 'Client demonstrates clear lung sounds, urinary output > 0.5 mL/kg/hr, and reports decreased dyspnea.',
      createdAt: '2026-10-20'
    }
  ];
}

export function saveCarePlan(plan: CarePlan): void {
  const current = getCarePlans();
  const updated = [plan, ...current];
  localStorage.setItem(STORAGE_KEYS.CARE_PLANS, JSON.stringify(updated));
}

export function getCPDRecords(): CPDRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CPD_RECORDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load CPD records', e);
  }
  return MOCK_CPD_RECORDS;
}

export function saveCPDRecord(record: CPDRecord): void {
  const current = getCPDRecords();
  const updated = [record, ...current];
  localStorage.setItem(STORAGE_KEYS.CPD_RECORDS, JSON.stringify(updated));
}

export function getAdminMetrics(): AdminMetrics {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_METRICS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load admin metrics', e);
  }
  return INITIAL_ADMIN_METRICS;
}

export function getTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load transactions', e);
  }
  return INITIAL_TRANSACTIONS;
}

export function recordNewTransaction(tx: Transaction): void {
  const current = getTransactions();
  const updated = [tx, ...current];
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));

  // Update admin metrics
  const metrics = getAdminMetrics();
  metrics.monthlyRecurringRevenuePhp += tx.amountPhp;
  metrics.activeSubscribers += 1;
  metrics.tierBreakdown[tx.tierId] = (metrics.tierBreakdown[tx.tierId] || 0) + 1;
  metrics.paymentMethodBreakdown[tx.paymentMethod] = (metrics.paymentMethodBreakdown[tx.paymentMethod] || 0) + 1;
  localStorage.setItem(STORAGE_KEYS.ADMIN_METRICS, JSON.stringify(metrics));
}

export function getPaymentConfig(): PaymentGatewayConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENT_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load payment config', e);
  }
  return INITIAL_PAYMENT_CONFIG;
}

export function savePaymentConfig(config: PaymentGatewayConfig): void {
  localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(config));
}
