import React, { useState } from 'react';
import { 
  Globe, 
  Award, 
  FileText, 
  CheckSquare, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { COMPREHENSIVE_QUESTION_BANK } from '../../data/mockQuestions';
import { UserProfile } from '../../types';

interface InternationalZoneProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const InternationalZone: React.FC<InternationalZoneProps> = ({ user, onOpenSubscription }) => {
  const [activeTab, setActiveTab] = useState<'nclex_ngn' | 'uk_nmc' | 'ahpra_aus' | 'canada_cna' | 'pathways' | 'documents'>('nclex_ngn');
  const [selectedCountry, setSelectedCountry] = useState<'USA' | 'UK' | 'Australia' | 'Canada'>('USA');

  // International questions (NCLEX, UK-NMC, AHPRA)
  const intlQuestions = COMPREHENSIVE_QUESTION_BANK.filter((q) => q.zone === 'international');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);

  const currentQ = intlQuestions[currentIndex] || intlQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (showRationale) return;
    setSelectedOption(idx);
    setShowRationale(true);
    setAnsweredCount((prev) => prev + 1);
    if (idx === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowRationale(false);
    setCurrentIndex((prev) => (prev + 1) % intlQuestions.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              🌍 Zone 2: International Licensure & Global Mobility
            </span>
            <span className="text-cyan-300 text-xs font-semibold">USA • UK • AUS • CAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pass Global. Practice Anywhere with Zero Borders.
          </h1>
          <p className="text-sm text-cyan-100/90 mt-1 leading-relaxed">
            NCSBN 2024 Next Generation NCLEX (NGN), UK NMC Test of Competence (CBT & 10-Station OSCE), Australian AHPRA NMBA, and Canadian CNA credentialing roadmap with integrated ICN Code of Ethics and WHO Patient Safety Standards.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-4 text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">🇺🇸 NCLEX-RN NGN Case Studies</span>
            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">🇬🇧 UK NMC CBT + OSCE Station Criteria</span>
            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">🇦🇺 AHPRA / ANMAC Skills Assessment</span>
            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">🇨🇦 NNAS & NCLEX-Canada</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'nclex_ngn', label: '🇺🇸 NextGen NCLEX-RN (NCSBN)', badge: 'NGN Simulator' },
          { id: 'uk_nmc', label: '🇬🇧 UK NMC (CBT & OSCE)', badge: '10 Stations' },
          { id: 'ahpra_aus', label: '🇦🇺 AHPRA NMBA (Australia)', badge: 'OBA Pathway' },
          { id: 'canada_cna', label: '🇨🇦 Canada (NNAS & CNA)', badge: 'Express Entry' },
          { id: 'pathways', label: 'Country Licensure Roadmaps', badge: 'Step-by-Step' },
          { id: 'documents', label: 'Visa & Document Checklists', badge: 'CGFNS/PRC' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === tab.id ? 'bg-blue-800 text-cyan-200' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {activeTab === 'nclex_ngn' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    {currentQ.examType}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentQ.clientNeedCategory || 'Physiological Adaptation'}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  Cognitive: {currentQ.cognitiveLevel || 'Analysis'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-5">
                {currentQ.question}
              </h3>

              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctAnswerIndex;
                  let optionClass = 'border-slate-200 hover:border-blue-400 bg-white text-slate-800';

                  if (showRationale) {
                    if (isCorrect) {
                      optionClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20';
                    } else if (isSelected) {
                      optionClass = 'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      optionClass = 'border-slate-200 opacity-60 bg-slate-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showRationale}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-start space-x-3 cursor-pointer ${optionClass}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        showRationale && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : showRationale && isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>

              {showRationale && (
                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>NCSBN Clinical Judgment Model Rationale</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentQ.rationale}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
                    Standard: {currentQ.referenceStandard}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Adaptive Item: 85 min – 150 max
                </span>
                <button
                  onClick={handleNext}
                  disabled={!showRationale}
                  className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-40"
                >
                  <span>Next Clinical Item</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* NCSBN 6 Cognitive Cues */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">
                NCSBN Clinical Judgment Model (Layer 3)
              </h4>
              <p className="text-xs text-slate-500">
                The 6 essential cognitive steps tested in all NextGen NCLEX case studies:
              </p>

              <div className="space-y-2 text-xs">
                {[
                  { step: '1. Recognize Cues', desc: 'Identify relevant clinical data, vital trends, and lab alerts' },
                  { step: '2. Analyze Cues', desc: 'Connect cues to underlying disease process and patient history' },
                  { step: '3. Prioritize Hypotheses', desc: 'Determine the most likely and most serious emergency condition' },
                  { step: '4. Generate Solutions', desc: 'Formulate desirable outcomes and identify contraindicated drugs' },
                  { step: '5. Take Action', desc: 'Execute prioritized interventions (Airway, Oxygen, Meds, IV)' },
                  { step: '6. Evaluate Outcomes', desc: 'Compare observed clinical status with anticipated responses' },
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-blue-900 text-[11px] block">{s.step}</span>
                    <span className="text-[11px] text-slate-600">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: UK NMC CBT & OSCE */}
      {activeTab === 'uk_nmc' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              UK NMC Test of Competence: 10-Station OSCE Blueprint
            </h3>
            <p className="text-xs text-slate-600">
              The Objective Structured Clinical Examination (OSCE) takes place at designated UK university testing centers (Northampton, Oxford Brookes, Ulster, Leeds Teaching Hospitals). Candidates must pass all 10 stations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/50 space-y-2">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                  Part 1: The 4 APIE Stations (Holistic Patient Care)
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li><strong>A - Assessment:</strong> 15 mins. Physical exam, NEWS2 (National Early Warning Score) calculation, Glasgow Coma Scale, SBAR handover prep.</li>
                  <li><strong>P - Planning:</strong> 14 mins. Two written nursing care plans addressing primary self-care deficit and acute medical priority.</li>
                  <li><strong>I - Implementation:</strong> 15 mins. Medication administration under 5 rights, checking British National Formulary (BNF) interactions, sterile water flush.</li>
                  <li><strong>E - Evaluation:</strong> 8 mins. Writing comprehensive discharge summary / SBAR transfer documentation.</li>
                </ul>
              </div>

              <div className="border border-purple-200 rounded-xl p-4 bg-purple-50/50 space-y-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  Part 2: 4 Clinical Skills + 2 Values/Professional Behaviour
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li><strong>ANTT:</strong> Aseptic Non-Touch Technique wound dressing or catheter care.</li>
                  <li><strong>Subcutaneous Injection:</strong> Correct needle angle, site rotation, insulin/heparin administration.</li>
                  <li><strong>In-Hospital Resuscitation:</strong> Basic Life Support (BLS) with bag-valve-mask and Automated External Defibrillator (AED).</li>
                  <li><strong>Peak Expiratory Flow Rate (PEFR):</strong> Asthma technique & patient education.</li>
                  <li><strong>Professional Values & Evidence-Based Practice:</strong> 2 silent written stations evaluating NMC Code adherence and research appraisal.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Country Roadmaps */}
      {activeTab === 'pathways' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-2">
            {(['USA', 'UK', 'Australia', 'Canada'] as const).map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCountry === country
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {country === 'USA' ? '🇺🇸 United States (EB-3)' : country === 'UK' ? '🇬🇧 United Kingdom (NHS)' : country === 'Australia' ? '🇦🇺 Australia (PR / 482)' : '🇨🇦 Canada (Express Entry)'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {selectedCountry === 'USA' && (
              <div className="space-y-3">
                {[
                  { step: 'Step 1: Credential Evaluation (CGFNS CES)', desc: 'Submit BSN transcript, CAV, and PRC Board Rating to CGFNS for US State Board eligibility verification.' },
                  { step: 'Step 2: US State Board Application & ATT', desc: 'Apply to state board (e.g. New York, Texas, Illinois) to receive Authorization to Test (ATT) from Pearson VUE.' },
                  { step: 'Step 3: Pass NCLEX-RN (NextGen NGN)', desc: 'Schedule and pass NCLEX-RN at Pearson VUE testing centers in Manila or Cebu (or international centers).' },
                  { step: 'Step 4: English Proficiency (IELTS or OET)', desc: 'Achieve IELTS Academic (Overall 6.5, Speaking 7.0) or OET Nursing (Grade B in all subtests).' },
                  { step: 'Step 5: CGFNS VisaScreen Certificate', desc: 'Receive official VisaScreen required by US Embassy consular officers for immigrant visa issuance.' },
                  { step: 'Step 6: Direct-Hire Employer / EB-3 Immigrant Visa', desc: 'Sign directly with hospital sponsor; file I-140 immigrant petition, receive Green Card, and relocate with family.' },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{s.step}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCountry === 'UK' && (
              <div className="space-y-3">
                {[
                  { step: 'Step 1: English Test First (IELTS or OET)', desc: 'IELTS Academic (L/R/S: 7.0, W: 6.5) or OET Grade B in Listening, Reading, Speaking and C+ in Writing.' },
                  { step: 'Step 2: NMC Online Application & Qualification Check', desc: 'Register on NMC UK portal; verify Philippine PRC license and university nursing curriculum.' },
                  { step: 'Step 3: Pass NMC CBT Part 1 (Adult Nursing)', desc: '115 multiple choice questions taken at Pearson VUE Manila or Cebu.' },
                  { step: 'Step 4: NHS Trust Interview & Certificate of Sponsorship (CoS)', desc: 'Direct online interview with UK NHS hospital; receive offer letter and Tier 2 Health & Care Worker Visa.' },
                  { step: 'Step 5: Fly to UK & 10-Station OSCE', desc: 'Hospital provides 4-6 weeks OSCE preceptor training; pass OSCE to obtain full UK NMC PIN number (Band 5 Staff Nurse).' },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{s.step}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCountry === 'Australia' && (
              <div className="space-y-3">
                {[
                  { step: 'Step 1: Self-Check on AHPRA Portal', desc: 'Identify your qualification pathway (Stream B for Philippine 4-year BSN graduates).' },
                  { step: 'Step 2: English Test (PTE Academic / IELTS / OET)', desc: 'PTE Academic 65 in all 4 skills or IELTS 7.0 in all bands or OET Grade B.' },
                  { step: 'Step 3: Outcomes-Based Assessment (OBA) Part 1: NCLEX-RN', desc: 'NCSBN NCLEX-RN is the official cognitive exam for Australian registration.' },
                  { step: 'Step 4: OBA Part 2: Objective Structured Clinical Exam (OSCE)', desc: 'Clinical station exam conducted in Adelaide, Australia.' },
                  { step: 'Step 5: ANMAC Migration Skills Assessment & PR Visa', desc: 'Apply for permanent residency via Subclass 189, 190, or Employer-Sponsored 482 visa.' },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{s.step}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCountry === 'Canada' && (
              <div className="space-y-3">
                {[
                  { step: 'Step 1: National Nursing Assessment Service (NNAS)', desc: 'Open file with NNAS to authenticate nursing education, employment history, and PRC credentials.' },
                  { step: 'Step 2: Advisory Report Issued', desc: 'NNAS evaluates comparability (Somewhat Comparable or Substantially Comparable).' },
                  { step: 'Step 3: Provincial Regulatory College Application', desc: 'Apply to British Columbia (BCCNM), Ontario (CNO), or Alberta (CRNA).' },
                  { step: 'Step 4: NCLEX-RN Canada', desc: 'Write NCLEX-RN (recognized across all Canadian provinces except Quebec).' },
                  { step: 'Step 5: Provincial Registration & Permanent Residency', desc: 'Receive RN license and apply through Express Entry Healthcare category.' },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{s.step}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Documents & Checklists */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Philippine Nurse International Credentialing Checklist
          </h3>
          <p className="text-xs text-slate-500">
            Keep verified digital scans of these mandatory documents ready in your NURSEPATH vault:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'PRC Board Certificate of Good Standing', authority: 'Professional Regulation Commission (PRC)' },
              { title: 'Official Transcript of Records (OTR) with Red Ribbon / Apostille', authority: 'Nursing School Registrar & DFA' },
              { title: 'Certificate of Course Description / Syllabus Breakdown', authority: 'Dean of Nursing College' },
              { title: 'PRC Board Exam Rating Certificate (Scores per Subject)', authority: 'PRC Central Office' },
              { title: 'Clinical Cases Record (Major/Minor OR, Deliveries, Cord Care)', authority: 'College of Nursing RLE Coordinator' },
              { title: 'Certificate of Employment & Bedside Clinical Hours Breakdown', authority: 'Hospital Human Resources Department' },
              { title: 'Valid Passport (Minimum 2 years validity)', authority: 'Department of Foreign Affairs (DFA)' },
              { title: 'Certified English Proficiency Score (IELTS / OET / PTE)', authority: 'British Council / IDP / OET' },
            ].map((doc, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 flex items-start space-x-2.5 bg-slate-50/40">
                <CheckSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-slate-900">{doc.title}</span>
                  <span className="block text-[11px] text-slate-500">{doc.authority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
