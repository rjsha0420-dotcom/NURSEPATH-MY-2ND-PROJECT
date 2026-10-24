import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileCheck, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Compass, 
  GitFork, 
  ShieldAlert, 
  Building,
  RotateCcw
} from 'lucide-react';
import { CHED_MSN_PROGRAM, DOCTORAL_TRACKS, RESEARCH_METHODS_TOOLKIT } from '../../data/mockGraduatePrograms';
import { COMPREHENSIVE_QUESTION_BANK } from '../../data/mockQuestions';
import { UserProfile, GraduateTab } from '../../types';

interface GraduateZoneProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const GraduateZone: React.FC<GraduateZoneProps> = ({ user, onOpenSubscription }) => {
  const [activeTab, setActiveTab] = useState<GraduateTab>('masteral');

  // Masteral state
  const [msnSubTab, setMsnSubTab] = useState<'ched_cmo5' | 'specializations' | 'thesis_builder' | 'entrance_exam'>('ched_cmo5');
  const [thesisTitle, setThesisTitle] = useState('');
  const [thesisTheoreticalModel, setThesisTheoreticalModel] = useState("Orem's Self-Care Deficit Nursing Theory");
  const [thesisMethod, setThesisMethod] = useState('Mixed-Methods Convergent Parallel Design');
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);

  // Doctoral state
  const [docSubTab, setDocSubTab] = useState<'degrees_comparison' | 'qualifying_exam' | 'dissertation_companion' | 'career_pathways'>('degrees_comparison');
  const [docMethodSelected, setDocMethodSelected] = useState(RESEARCH_METHODS_TOOLKIT[0]);

  // Exam drill state (MSN & Doctoral questions)
  const gradQuestions = COMPREHENSIVE_QUESTION_BANK.filter((q) => q.zone === 'graduate');
  const [gradQuestionIndex, setGradQuestionIndex] = useState(0);
  const [selectedGradOption, setSelectedGradOption] = useState<number | null>(null);
  const [showGradRationale, setShowGradRationale] = useState(false);

  const currentGradQ = gradQuestions[gradQuestionIndex] || gradQuestions[0];

  const handleGenerateThesisProposal = () => {
    if (!thesisTitle) return;
    setGeneratedProposal(
      `### 📘 Master of Science in Nursing (MSN) Research Proposal Brief\n\n**Working Title:** ${thesisTitle}\n**CHED CMO Basis:** CMO No. 5 Series of 2024 (PQF Level 7)\n**Theoretical / Conceptual Framework:** ${thesisTheoreticalModel}\n**Methodological Design:** ${thesisMethod}\n\n**Statement of the Problem:**\nDespite modern pharmacological and surgical advancements, patient outcomes are significantly moderated by self-care agency, nursing interventions, and institutional support systems. This study investigates the empirical relationship between structured advanced nursing interventions and clinical outcomes.\n\n**Research Objectives:**\n1. Establish baseline clinical indicators and demographic variables among target cohort.\n2. Implement advanced practice nursing protocol aligned with ${thesisTheoreticalModel}.\n3. Measure pre- and post-intervention effect size with 95% Confidence Interval (alpha = 0.05).\n\n**Ethical Clearance Requirements:** Review under Philippine Health Research Ethics Board (PHREB) Level 2/3 Accredited Institutional Ethics Review Board (IERC).`
    );
  };

  const handleAnswerGradQ = (idx: number) => {
    if (showGradRationale) return;
    setSelectedGradOption(idx);
    setShowGradRationale(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Primary Side-by-Side Dual Tab Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex space-x-2 w-full sm:w-auto">
          {/* Masteral Tab Button: Blue Theme (#1E40AF) */}
          <button
            onClick={() => setActiveTab('masteral')}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
              activeTab === 'masteral'
                ? 'bg-[#1E40AF] text-white shadow-md ring-2 ring-blue-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-200" />
            <span>📗 MASTERAL TAB — MSN / MScN (PQF Level 7)</span>
          </button>

          {/* Doctoral Tab Button: Purple Theme (#7C3AED) */}
          <button
            onClick={() => setActiveTab('doctoral')}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
              activeTab === 'doctoral'
                ? 'bg-[#7C3AED] text-white shadow-md ring-2 ring-purple-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-200" />
            <span>📕 DOCTORAL TAB — PhD / DScN / DNP (PQF Level 8)</span>
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500 hidden md:block">
          CHED Compliant & International Graduate Standards
        </span>
      </div>

      {/* ======================================================== */}
      {/* 📗 MASTERAL TAB CONTENT — BLUE THEME (#1E40AF)           */}
      {/* ======================================================== */}
      {activeTab === 'masteral' && (
        <div className="space-y-6">
          {/* Masteral Banner */}
          <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border-2 border-blue-400/30">
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  📗 Masteral Zone • CHED CMO No. 5 Series of 2024
                </span>
                <span className="text-blue-300 text-xs font-semibold">PQF Level 7 Specialist</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Master of Science in Nursing (MSN) & Master in Nursing (MN)
              </h2>
              <p className="text-sm text-blue-100/90 mt-1 leading-relaxed">
                CHED CMO 5 s.2024 curriculum: 36-48 graduate units, Academic (Thesis) vs Professional (Non-Thesis/Capstone) tracks, 6 Core Foundations, and advanced clinical specializations.
              </p>

              <div className="flex flex-wrap gap-2.5 mt-4 text-xs">
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">36 - 48 Units (2-3 Academic Years)</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">Mandated for Philippine Nursing Faculty</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">Clinical Nurse Specialist (CNS) Pathway</span>
              </div>
            </div>
          </div>

          {/* Masteral Sub-Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
            {[
              { id: 'ched_cmo5', label: 'CHED CMO 5 s.2024 Standards', badge: 'Curriculum' },
              { id: 'specializations', label: '5 Clinical Specializations', badge: 'Adult, Pedia, Psych' },
              { id: 'thesis_builder', label: 'MSN Thesis / Capstone Builder', badge: 'Proposal Tool' },
              { id: 'entrance_exam', label: 'Graduate Entrance Exam Prep', badge: 'Aptitude & Theory' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setMsnSubTab(sub.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                  msnSubTab === sub.id
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{sub.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  msnSubTab === sub.id ? 'bg-blue-900 text-blue-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {sub.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Sub-Tab 1: CHED CMO 5 s.2024 Core Syllabi */}
          {msnSubTab === 'ched_cmo5' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHED_MSN_PROGRAM.coreCourses.map((course) => (
                  <div key={course.code} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {course.code} • {course.units} Units
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">Core Graduate Requirement</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{course.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>
                  </div>
                ))}
              </div>

              {/* Academic vs Professional Track Comparison */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 mt-6">
                <h3 className="font-extrabold text-base text-slate-900">
                  Academic (Thesis) Track vs. Professional (Non-Thesis Capstone) Track
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                    <span className="font-bold text-sm text-blue-900 block">Academic / Thesis Track (MSN)</span>
                    <p className="text-slate-700">
                      Designed for nurses intending to teach in higher education institutions (HEIs), pursue PhD/doctorates, or conduct rigorous health systems research. Requires comprehensive oral thesis defense and peer-reviewed journal submission.
                    </p>
                    <span className="text-[11px] font-bold text-blue-800 block">6 Units Thesis (NUR 799A & 799B)</span>
                  </div>

                  <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
                    <span className="font-bold text-sm text-teal-900 block">Professional / Non-Thesis Track (MN)</span>
                    <p className="text-slate-700">
                      Designed for advanced bedside practitioners, chief nursing officers, and clinical nurse specialists. In place of a formal thesis, candidates execute a 6-unit Evidence-Based Clinical Capstone Project or Quality Improvement (QI) translation.
                    </p>
                    <span className="text-[11px] font-bold text-teal-800 block">6 Units Capstone / Clinical Residency</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Specializations */}
          {msnSubTab === 'specializations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHED_MSN_PROGRAM.specializations.map((spec, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{spec}</h4>
                  <p className="text-xs text-slate-600">
                    In-depth advanced pharmacotherapeutics, pathophysiology, and 300+ hours of specialized clinical residency under certified clinical preceptors.
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-700">
                    PQF Level 7 Professional Benchmark
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab 3: MSN Thesis Proposal Builder */}
          {msnSubTab === 'thesis_builder' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <h3 className="font-extrabold text-base text-slate-900">
                Interactive MSN Thesis & Capstone Proposal Builder
              </h3>
              <p className="text-xs text-slate-500">
                Draft a structured thesis proposal aligned with CHED CMO 5 s.2024 and institutional review board requirements:
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Proposed Research / Capstone Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Effectiveness of a Nurse-Led Telehealth Transitional Care Program on 30-Day Readmission Rates Among Congestive Heart Failure Patients in Metro Manila"
                    value={thesisTitle}
                    onChange={(e) => setThesisTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Theoretical Nursing Framework</label>
                    <select
                      value={thesisTheoreticalModel}
                      onChange={(e) => setThesisTheoreticalModel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                    >
                      <option>Orem's Self-Care Deficit Nursing Theory</option>
                      <option>Sister Callista Roy's Adaptation Model</option>
                      <option>Jean Watson's Theory of Human Caring</option>
                      <option>Donabedian Structure-Process-Outcome Framework</option>
                      <option>Iowa Model of Evidence-Based Practice</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Research Methodology</label>
                    <select
                      value={thesisMethod}
                      onChange={(e) => setThesisMethod(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                    >
                      <option>Mixed-Methods Convergent Parallel Design</option>
                      <option>Randomized Controlled Clinical Trial (RCT)</option>
                      <option>Quasi-Experimental Pretest-Posttest Design</option>
                      <option>Phenomenological Qualitative Inquiry (Colaizzi)</option>
                      <option>PRISMA Systematic Review & Meta-Analysis</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateThesisProposal}
                  className="bg-[#1E40AF] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  Generate Structured Proposal Concept
                </button>
              </div>

              {generatedProposal && (
                <div className="mt-4 p-5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-3 animate-fadeIn">
                  <div className="whitespace-pre-line text-slate-800 leading-relaxed font-sans">
                    {generatedProposal}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 4: Entrance Exam Prep */}
          {msnSubTab === 'entrance_exam' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  Graduate Entrance & Theory Drill
                </span>
                <span className="text-xs text-slate-500">CHED CMO 5 s.2024</span>
              </div>

              <h4 className="font-bold text-slate-900 text-base">{currentGradQ.question}</h4>

              <div className="space-y-2.5">
                {currentGradQ.options.map((opt, idx) => {
                  const isCorrect = idx === currentGradQ.correctAnswerIndex;
                  const isSelected = selectedGradOption === idx;
                  let optStyle = 'border-slate-200 bg-white hover:border-blue-400';

                  if (showGradRationale) {
                    if (isCorrect) optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    else if (isSelected) optStyle = 'border-rose-400 bg-rose-50';
                    else optStyle = 'border-slate-200 opacity-60';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerGradQ(idx)}
                      disabled={showGradRationale}
                      className={`w-full text-left p-3 rounded-xl border-2 text-xs flex items-center space-x-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[11px]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showGradRationale && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                  <span className="font-bold text-blue-900 block">Graduate Rationale:</span>
                  <p className="text-slate-700 leading-relaxed">{currentGradQ.rationale}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 📕 DOCTORAL TAB CONTENT — PURPLE THEME (#7C3AED)          */}
      {/* ======================================================== */}
      {activeTab === 'doctoral' && (
        <div className="space-y-6">
          {/* Doctoral Banner */}
          <div className="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border-2 border-purple-400/30">
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  📕 Doctoral Zone • Terminal Nursing Degrees
                </span>
                <span className="text-purple-300 text-xs font-semibold">PQF Level 8 Terminal Mastery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                PhD in Nursing • Doctor of Science (DScN) • Doctor of Nursing Practice (DNP)
              </h2>
              <p className="text-sm text-purple-100/90 mt-1 leading-relaxed">
                The pinnacle of global nursing scholarship: generating original epistemological theories, executing translational clinical trials, and leading systems-level health policy reform worldwide.
              </p>

              <div className="flex flex-wrap gap-2.5 mt-4 text-xs">
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">PQF Level 8 Descriptors</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">Doctoral Qualifying Exam Prep</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">Full Dissertation Companion</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">Global Research Fellowships & Grants</span>
              </div>
            </div>
          </div>

          {/* Doctoral Sub-Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
            {[
              { id: 'degrees_comparison', label: 'PhD vs DScN vs DNP Matrix', badge: '3 Doctoral Degrees' },
              { id: 'qualifying_exam', label: 'Doctoral Qualifying Exam Drill', badge: 'Comprehensive' },
              { id: 'dissertation_companion', label: 'Dissertation & Methodology Wizard', badge: 'PRISMA & RCT' },
              { id: 'career_pathways', label: 'Academic & Professorship Pathways', badge: 'Tenure & Grants' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setDocSubTab(sub.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                  docSubTab === sub.id
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{sub.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  docSubTab === sub.id ? 'bg-purple-900 text-purple-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {sub.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Doctoral Sub-Tab 1: Degree Comparison Matrix */}
          {docSubTab === 'degrees_comparison' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DOCTORAL_TRACKS.map((doc) => (
                  <div key={doc.degreeType} className="bg-white rounded-2xl p-5 border border-purple-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-purple-800 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                          {doc.degreeType}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">PQF Level {doc.pqfLevel}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-2">{doc.fullName}</h4>
                      <p className="text-xs font-semibold text-purple-700 mt-0.5">{doc.focus}</p>

                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <span className="font-bold text-slate-800 text-[11px]">Core Competencies:</span>
                        <ul className="space-y-1 text-slate-600 text-[11px]">
                          {doc.competencies.map((comp, idx) => (
                            <li key={idx} className="flex items-start space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                              <span>{comp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                      <strong>Global Equivalent:</strong> {doc.internationalEquivalents}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctoral Sub-Tab 2: Qualifying Exam */}
          {docSubTab === 'qualifying_exam' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                  Doctoral Comprehensive Examination Simulator
                </span>
                <span className="text-xs text-slate-500">PQF Level 8 Epistemology</span>
              </div>

              <h4 className="font-bold text-slate-900 text-base">
                In doctoral nursing scholarship (PQF Level 8), which epistemological paradigm best underpins a mixed-methods convergent parallel design investigating both the biochemical biomarker changes (cortisol/IL-6) of chronic clinical nurse burnout and the lived phenomenological existential distress of bedside nurses?
              </h4>

              <div className="space-y-2.5">
                {[
                  'Positivism / Post-positivism solely',
                  'Constructivism / Interpretivism exclusively',
                  'Pragmatism (combining empirical measurement with humanistic interpretive meaning)',
                  'Critical Feminist Theory exclusively'
                ].map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs flex items-center space-x-3 ${
                      idx === 2 ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[11px]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-purple-900">Doctoral Panel Evaluation:</span>
                <p className="text-slate-700 leading-relaxed">
                  Pragmatism rejects epistemological purism and serves as the primary philosophical foundation for mixed-methods inquiries, supporting the simultaneous generation of objective physiological data and subjective qualitative narratives.
                </p>
              </div>
            </div>
          )}

          {/* Doctoral Sub-Tab 3: Dissertation Companion & Methodology */}
          {docSubTab === 'dissertation_companion' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Methodology Frameworks
                </span>
                {RESEARCH_METHODS_TOOLKIT.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDocMethodSelected(m)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      docMethodSelected.method === m.method
                        ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-xs block font-bold">{m.method}</span>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Methodology Specification
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900">{docMethodSelected.method}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{docMethodSelected.description}</p>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800">Critical Phased Milestones:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {docMethodSelected.phases.map((ph, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                          <span className="text-slate-800 font-medium">{ph}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doctoral Sub-Tab 4: Academic Career Pathways */}
          {docSubTab === 'career_pathways' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">
                Doctoral Career Trajectories & Global Health Fellowships
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                  <span className="font-bold text-sm text-purple-900 block">Tenure-Track Professorship & Deanship</span>
                  <p className="text-slate-600">
                    Lead nursing faculties in premier global universities. Supervise masteral and doctoral theses, manage academic accreditation, and publish in Scopus Q1 journals.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                  <span className="font-bold text-sm text-blue-900 block">WHO & International Health Policy</span>
                  <p className="text-slate-600">
                    Direct public health policy, pandemic response protocols, and workforce planning at the World Health Organization (WHO), ICN, and Ministry of Health levels.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
                  <span className="font-bold text-sm text-teal-900 block">Clinical Scientist / Principal Investigator</span>
                  <p className="text-slate-600">
                    Direct multi-center clinical trials in university medical centers, securing competitive research grants (NIH, PCHRD, Sigma Theta Tau).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
