export interface CourseCurriculum {
  id: string;
  year: number; // 1, 2, 3, 4
  semester: 1 | 2 | 'Summer';
  code: string;
  title: string;
  lectureUnits: number;
  labUnits: number;
  rleHours: number;
  description: string;
  competencyFocus: string[];
}

export const CHED_BSN_CURRICULUM: CourseCurriculum[] = [
  // Year 1
  {
    id: 'n101',
    year: 1,
    semester: 1,
    code: 'NURS 101',
    title: 'Theoretical Foundations in Nursing (TFN)',
    lectureUnits: 3,
    labUnits: 0,
    rleHours: 0,
    description: 'Philosophical, historical, and theoretical perspectives in nursing with emphasis on Florence Nightingale, Virginia Henderson, Dorothea Orem, Sister Callista Roy, and Jean Watson.',
    competencyFocus: ['Ethico-Moral Responsibility', 'Personal & Professional Development']
  },
  {
    id: 'n102',
    year: 1,
    semester: 1,
    code: 'ANAT 101',
    title: 'Anatomy and Physiology',
    lectureUnits: 3,
    labUnits: 2,
    rleHours: 102,
    description: 'Detailed study of human body structures, physiological mechanisms, cellular homeostasis, and organ systems.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Communication']
  },
  {
    id: 'n103',
    year: 1,
    semester: 2,
    code: 'NURS 102',
    title: 'Fundamentals of Nursing Practice (FNP)',
    lectureUnits: 3,
    labUnits: 2,
    rleHours: 102,
    description: 'Basic nursing concepts, nursing process (ADPIE), infection control, vital signs, bed making, hygienic care, aseptic technique, and medication administration.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Management of Environment & Resources']
  },
  {
    id: 'n104',
    year: 1,
    semester: 2,
    code: 'MICR 101',
    title: 'Microbiology and Parasitology',
    lectureUnits: 3,
    labUnits: 1,
    rleHours: 51,
    description: 'Host-parasite relationships, infectious disease pathogenesis, sterilization, disinfection, and hospital infection control.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Quality Improvement']
  },

  // Year 2
  {
    id: 'n201',
    year: 2,
    semester: 1,
    code: 'NURS 201',
    title: 'Community Health Nursing I (Individual and Family)',
    lectureUnits: 2,
    labUnits: 2,
    rleHours: 102,
    description: 'Primary health care, family health assessment, home visits, DOH national health programs (EPI, IMCI), and Bag Technique.',
    competencyFocus: ['Health Education', 'Collaboration and Teamwork']
  },
  {
    id: 'n202',
    year: 2,
    semester: 1,
    code: 'PHAR 201',
    title: 'Pharmacology for Nursing',
    lectureUnits: 3,
    labUnits: 0,
    rleHours: 0,
    description: 'Pharmacokinetics, pharmacodynamics, high-alert drug safety, calculation of dosage and IV rates, adverse drug reactions.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Legal Responsibility']
  },
  {
    id: 'n203',
    year: 2,
    semester: 2,
    code: 'NURS 202',
    title: 'Care of Mother, Child, and Adolescent (MCN I)',
    lectureUnits: 4,
    labUnits: 5,
    rleHours: 255,
    description: 'Normal antepartum, intrapartum, postpartum, newborn care (Essential Intrapartum and Newborn Care - EINC), and pediatric growth and development.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Ethico-Moral Responsibility']
  },
  {
    id: 'n204',
    year: 2,
    semester: 2,
    code: 'NURS 203',
    title: 'Nutrition and Diet Therapy',
    lectureUnits: 2,
    labUnits: 1,
    rleHours: 51,
    description: 'Dietary management for pathological conditions: renal diets, diabetic exchanges, low-sodium DASH, total parenteral nutrition (TPN).',
    competencyFocus: ['Health Education', 'Quality Improvement']
  },

  // Year 3
  {
    id: 'n301',
    year: 3,
    semester: 1,
    code: 'NURS 301',
    title: 'Care of Clients with Problems in Cellular Aberrations, Acute Biologic Crisis (Med-Surg I)',
    lectureUnits: 4,
    labUnits: 5,
    rleHours: 255,
    description: 'Pathophysiology and holistic nursing management for cardiovascular, pulmonary, oncological, and hematologic critical conditions.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Management of Environment & Resources']
  },
  {
    id: 'n302',
    year: 3,
    semester: 1,
    code: 'NURS 302',
    title: 'Nursing Research I (Quantitative & Qualitative)',
    lectureUnits: 2,
    labUnits: 1,
    rleHours: 51,
    description: 'Scientific inquiry, formulation of nursing research problem, theoretical framework, sampling, ethics (PHREB & Declaration of Helsinki).',
    competencyFocus: ['Research', 'Quality Improvement']
  },
  {
    id: 'n303',
    year: 3,
    semester: 2,
    code: 'NURS 303',
    title: 'Care of Clients with Maladaptive Patterns of Behavior (Psychiatric Nursing)',
    lectureUnits: 3,
    labUnits: 2,
    rleHours: 102,
    description: 'Therapeutic communication, schizophrenia spectrum, mood disorders, substance dependence, crisis intervention, psychopharmacology.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Ethico-Moral Responsibility', 'Communication']
  },
  {
    id: 'n304',
    year: 3,
    semester: 2,
    code: 'NURS 304',
    title: 'Nursing Research II (Data Analysis & Defense)',
    lectureUnits: 1,
    labUnits: 2,
    rleHours: 102,
    description: 'Data gathering, biostatistical analysis (SPSS/Jamovi), interpretation of results, oral defense, and research dissemination.',
    competencyFocus: ['Research', 'Personal and Professional Development']
  },

  // Year 4
  {
    id: 'n401',
    year: 4,
    semester: 1,
    code: 'NURS 401',
    title: 'Nursing Leadership, Management, and Professional Adjustment',
    lectureUnits: 4,
    labUnits: 3,
    rleHours: 153,
    description: 'Philippine Nursing Act of 2002 (RA 9173), Code of Ethics, negligence, malpractice, transformational leadership, staffing, budgeting, and conflict resolution.',
    competencyFocus: ['Management of Environment & Resources', 'Legal Responsibility', 'Collaboration and Teamwork']
  },
  {
    id: 'n402',
    year: 4,
    semester: 1,
    code: 'NURS 402',
    title: 'Disaster Nursing and Emergency Management',
    lectureUnits: 2,
    labUnits: 1,
    rleHours: 51,
    description: 'Mass casualty triage (START / SALT), disaster cycle preparedness, BLS/ACLS protocols, ICS (Incident Command System), and psychological first aid.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Collaboration and Teamwork']
  },
  {
    id: 'n403',
    year: 4,
    semester: 2,
    code: 'NURS 403',
    title: 'Intensive Clinical Practicum / Immersion (RLE Capstone)',
    lectureUnits: 0,
    labUnits: 8,
    rleHours: 408,
    description: 'Comprehensive clinical internship rotations in tertiary hospitals (ICU, CCU, ER, OR/DR, NICU) and rural community health teams.',
    competencyFocus: ['Safe and Quality Nursing Care', 'Personal and Professional Development', 'Record Management']
  }
];

export interface PhilippineCoreCompetency {
  code: string;
  title: string;
  chedRef: string;
  description: string;
  indicators: string[];
}

export const PHILIPPINE_NURSING_COMPETENCIES: PhilippineCoreCompetency[] = [
  {
    code: 'COMP-01',
    title: 'Safe and Quality Nursing Care',
    chedRef: 'CMO 15 s.2017 Core Area 1',
    description: 'Demonstrates knowledge of physical, social, natural and health sciences and applies nursing process in care delivery.',
    indicators: [
      'Executes accurate patient health assessment & vital signs monitoring',
      'Formulates prioritized NANDA-I nursing diagnoses based on clinical cues',
      'Implements physician orders and nursing interventions safely with aseptic technique',
      'Monitors patient response to treatment and medication administration'
    ]
  },
  {
    code: 'COMP-02',
    title: 'Management of Resources & Environment',
    chedRef: 'CMO 15 s.2017 Core Area 2',
    description: 'Organizes work load, facilitates safe therapeutic environment, and ensures availability of medical supplies and equipment.',
    indicators: [
      'Maintains clean, infection-controlled patient environment adhering to standard precautions',
      'Utilizes hospital equipment according to manufacturer safety guidelines',
      'Manages ward resources and medical supplies cost-effectively'
    ]
  },
  {
    code: 'COMP-03',
    title: 'Health Education',
    chedRef: 'CMO 15 s.2017 Core Area 3',
    description: 'Assesses learning needs of individuals, families, and communities, formulating and implementing appropriate health teaching plans.',
    indicators: [
      'Identifies barriers to patient learning (literacy, language, cultural)',
      'Conducts discharge teaching on medication regimen and warning signs',
      'Implements community-wide immunization and lifestyle disease prevention campaigns'
    ]
  },
  {
    code: 'COMP-04',
    title: 'Legal Responsibility',
    chedRef: 'CMO 15 s.2017 Core Area 4',
    description: 'Adheres to Philippine Nursing Act (RA 9173), statutory laws, informed consent principles, and medical jurisprudence.',
    indicators: [
      'Validates signed informed consent before invasive surgical procedures',
      'Maintains accurate, timely, and tamper-free electronic & paper charting',
      'Protects patient rights and confidentiality under RA 10173 (Data Privacy Act)'
    ]
  },
  {
    code: 'COMP-05',
    title: 'Ethico-Moral Responsibility',
    chedRef: 'CMO 15 s.2017 Core Area 5',
    description: 'Applies moral principles (Autonomy, Beneficence, Non-maleficence, Justice, Veracity) and the Code of Ethics for Philippine Nurses.',
    indicators: [
      'Advocates for vulnerable, pediatric, and unconscious patients',
      'Navigates end-of-life directives (DNR, palliative care decisions) ethically',
      'Treats all patients without discrimination regardless of socio-economic status'
    ]
  },
  {
    code: 'COMP-06',
    title: 'Research & Evidence-Based Practice',
    chedRef: 'CMO 15 s.2017 Core Area 8',
    description: 'Critiques scientific nursing literature and applies validated evidence to elevate bedside patient outcomes.',
    indicators: [
      'Applies Joanna Briggs Institute (JBI) or Cochrane systematic review recommendations',
      'Participates in clinical audits and institutional research activities',
      'Disseminates findings to clinical peers during nursing grand rounds'
    ]
  }
];

export interface ClinicalCasesTracker {
  category: string;
  requiredCount: number;
  completedCount: number;
  minimumLevel: string;
}

export const CHED_CLINICAL_REQUIREMENTS: ClinicalCasesTracker[] = [
  { category: 'Major Operating Room Scrub/Circulating Cases', requiredCount: 5, completedCount: 5, minimumLevel: 'Tertiary Hospital' },
  { category: 'Minor Operating Room Scrub Cases', requiredCount: 5, completedCount: 5, minimumLevel: 'Secondary/Tertiary Hospital' },
  { category: 'Actual Spontaneous Vaginal Deliveries Handled', requiredCount: 5, completedCount: 4, minimumLevel: 'Maternity/Lying-in Unit' },
  { category: 'Immediate Newborn Cord Care Assisted', requiredCount: 5, completedCount: 5, minimumLevel: 'Delivery Room' },
  { category: 'Community Organizing & Family Case Study', requiredCount: 2, completedCount: 2, minimumLevel: 'Rural Health Unit (RHU)' },
  { category: 'Intensive Care Unit (ICU/CCU) Rotation Hours', requiredCount: 160, completedCount: 140, minimumLevel: 'Critical Care Center' },
  { category: 'Emergency Room (ER) Rotation Hours', requiredCount: 160, completedCount: 160, minimumLevel: 'Trauma/Emergency Center' }
];
