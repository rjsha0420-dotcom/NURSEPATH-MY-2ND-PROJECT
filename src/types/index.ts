export type UserRole =
  | 'undergrad'
  | 'newgrad'
  | 'rn'
  | 'masteral'
  | 'phd'
  | 'faculty'
  | 'admin';

export type SubscriptionTierId =
  | 'start'      // Tier 1: ₱0
  | 'growth'     // Tier 2: ₱99/mo (₱79 annual)
  | 'ready'      // Tier 3: ₱199/mo (₱159 annual)
  | 'specialist' // Tier 4: ₱349/mo (₱299 annual)
  | 'scholar';   // Tier 5: ₱499/mo (₱429 annual)

export type BillingCycle = 'monthly' | 'annual';

export type PaymentMethodType =
  | 'gcash'
  | 'maya'
  | 'card'
  | 'bank_dragonpay'
  | 'otc_dragonpay'
  | 'paypal';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: SubscriptionTierId;
  billingCycle: BillingCycle;
  subscriptionExpiresAt: string;
  avatarUrl?: string;
  schoolOrHospital: string;
  targetExam: string; // 'PNLE' | 'NCLEX-RN' | 'UK NMC' | 'AHPRA' | 'MSN' | 'PhD'
  targetCountry: string; // 'Philippines' | 'USA' | 'UK' | 'Australia' | 'Canada' | 'Middle East'
  specialtyInterest: string;
  clinicalHoursCompleted: number;
  cpdUnitsCompleted: number;
  pnleReadinessScore: number;
  savedDecksCount: number;
  isGuest?: boolean;
}

export type ZoneId =
  | 'undergraduate'
  | 'international'
  | 'practitioner'
  | 'graduate'
  | 'study_lounge'
  | 'community'
  | 'admin';

export type GraduateTab = 'masteral' | 'doctoral';

// SM-2 Flashcard
export interface Flashcard {
  id: string;
  deckId: string;
  category: string;
  front: string;
  back: string;
  pearl: string;
  evidenceLevel: string; // 'Level I (RCT/Systematic)' | 'Level II' | 'Level III' | 'Expert Opinion'
  reps: number;
  interval: number; // in days
  easeFactor: number; // default 2.5
  dueDate: string;
  tags: string[];
}

// Question / Quiz item
export interface QuizQuestion {
  id: string;
  zone: 'undergrad' | 'international' | 'specialist' | 'graduate';
  examType: string; // 'PNLE' | 'NCLEX-RN' | 'UK-NMC' | 'AHPRA' | 'MSN-ENTRANCE' | 'DOCTORAL-QUAL'
  subject: string;
  subtopic?: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  rationale: string;
  clientNeedCategory?: string; // NCSBN category
  cognitiveLevel?: string; // Bloom's: Analysis, Application, Evaluation
  referenceStandard: string; // e.g., 'CHED CMO 15 s.2017' | 'NCSBN Test Plan 2024' | 'ICN Practice'
}

// Drug Reference
export interface DrugItem {
  id: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  indications: string;
  mechanism: string;
  standardDose: string;
  pediatricDose?: string;
  ivAdministration: {
    pushRate: string;
    dilution: string;
    compatibility: string[];
  };
  highAlert: boolean;
  blackBoxWarning?: string;
  antidote?: string;
  nursingConsiderations: string[];
  monitoringParameters: string[];
  patientTeaching: string[];
  pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X';
}

// Lab Reference
export interface LabItem {
  id: string;
  name: string;
  category: 'Electrolytes' | 'CBC' | 'Coagulation' | 'Cardiac' | 'Renal' | 'Liver' | 'ABG';
  conventionalRange: string;
  siUnits: string;
  criticalLow: string;
  criticalHigh: string;
  causesHigh: string[];
  causesLow: string[];
  nursingImplications: string[];
  priorityAlert: string;
}

// Clinical Calculator
export interface ClinicalCalcResult {
  title: string;
  result: string | number;
  unit: string;
  interpretation: string;
  warning?: string;
}

// Care Plan
export interface CarePlan {
  id: string;
  patientProfile: string;
  nandaDiagnosis: string;
  relatedTo: string;
  asEvidencedBy: string;
  nocOutcomes: string[];
  nicInterventions: {
    action: string;
    rationale: string;
  }[];
  evaluationCriteria: string;
  createdAt: string;
}

// CPD Log
export interface CPDRecord {
  id: string;
  title: string;
  provider: string;
  dateCompleted: string;
  category: 'PRC Credit Units' | 'UK NMC Revalidation' | 'AHPRA CPD' | 'CNA Contact Hours';
  units: number;
  certificateRef?: string;
  evidenceType: string;
}

// Masteral / MSN Program
export interface MSNTrack {
  id: string;
  title: string;
  degreeName: string; // e.g., 'Master of Science in Nursing (MSN)'
  chedBasis: string; // 'CHED CMO No. 5 Series of 2024'
  pqfLevel: 7;
  totalUnits: number; // 36-48 units
  duration: string; // '2 - 3 Years'
  tracks: ('Academic / Thesis Track' | 'Professional / Non-Thesis Track')[];
  coreCourses: {
    code: string;
    title: string;
    units: number;
    description: string;
  }[];
  specializations: string[];
  careerOutcomes: string[];
}

// Doctoral Program
export interface DoctoralTrack {
  id?: string;
  degreeType: 'PhD' | 'DScN' | 'DNP';
  fullName: string;
  pqfLevel: 8;
  focus: string; // 'Research / Theory Generation' | 'Clinical Science' | 'Systems Leadership'
  chedBasis: string;
  competencies: string[];
  qualifyingExamTopics: string[];
  dissertationRequirements: string[];
  internationalEquivalents: string;
}

// Payment & Admin
export interface Transaction {
  id: string;
  date: string;
  userName: string;
  userEmail: string;
  tierId: SubscriptionTierId;
  tierName: string;
  amountPhp: number;
  paymentMethod: PaymentMethodType;
  status: 'completed' | 'pending' | 'refunded';
  payoutStatus: 'settled' | 'processing';
  payoutDestination: string;
  referenceNumber: string;
}

export interface AdminMetrics {
  totalUsers: number;
  activeSubscribers: number;
  monthlyRecurringRevenuePhp: number;
  yearlyProjectedPhp: number;
  churnRatePercent: number;
  conversionRatePercent: number;
  tierBreakdown: Record<SubscriptionTierId, number>;
  paymentMethodBreakdown: Record<PaymentMethodType, number>;
}
