import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ChevronRight, 
  FileCheck, 
  BarChart3, 
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { CHED_BSN_CURRICULUM, PHILIPPINE_NURSING_COMPETENCIES, CHED_CLINICAL_REQUIREMENTS } from '../../data/mockCurriculum';
import { COMPREHENSIVE_QUESTION_BANK } from '../../data/mockQuestions';
import { UserProfile } from '../../types';

interface UndergraduateZoneProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const UndergraduateZone: React.FC<UndergraduateZoneProps> = ({ user, onOpenSubscription }) => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'rle_tracker' | 'competencies' | 'pnle_reviewer' | 'intl_compare'>('pnle_reviewer');
  const [selectedYear, setSelectedYear] = useState<number>(4);

  // PNLE Reviewer state
  const pnleQuestions = COMPREHENSIVE_QUESTION_BANK.filter((q) => q.zone === 'undergrad');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);

  const currentQ = pnleQuestions[currentQuestionIndex] || pnleQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (showRationale) return;
    setSelectedOption(idx);
    setShowRationale(true);
    setAnsweredCount((prev) => prev + 1);
    if (idx === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowRationale(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % pnleQuestions.length);
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setShowRationale(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Zone Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              📘 Zone 1: Undergraduate & PNLE Reviewer
            </span>
            <span className="text-teal-300 text-xs font-semibold">PQF Level 6</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CHED CMO 15 s.2017 & Philippine Nursing Board Mastery
          </h1>
          <p className="text-sm text-teal-100/90 mt-1 leading-relaxed">
            Full 4-Year BSN curriculum, accredited Related Learning Experiences (RLE) logbook, 11 National Core Competencies, and the comprehensive 5-Subject Philippine Nurse Licensure Examination (PNLE) prep system.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
            <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-2">
              <Award className="w-4 h-4 text-teal-300" />
              <span>5 PNLE Subjects × 20% Weight</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-300" />
              <span>2,142+ Mandated Clinical RLE Hours</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>15,000+ Item PNLE Question Bank</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'pnle_reviewer', label: '🇵🇭 PNLE Board Reviewer', badge: '15k Questions' },
          { id: 'curriculum', label: 'CHED 4-Year Curriculum', badge: 'CMO 15 s.2017' },
          { id: 'rle_tracker', label: 'Clinical Hours (RLE) Tracker', badge: 'Logbook' },
          { id: 'competencies', label: '11 National Core Competencies', badge: 'PRC Standards' },
          { id: 'intl_compare', label: 'International Comparison', badge: 'BSN vs Global' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === tab.id ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: PNLE Reviewer */}
      {activeTab === 'pnle_reviewer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    {currentQ.subject}
                  </span>
                  <span className="text-xs text-slate-500 ml-2 font-medium">
                    Topic: {currentQ.subtopic || 'High-Yield Clinical Concept'}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  Item {currentQuestionIndex + 1} of {pnleQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-5">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctAnswerIndex;
                  let optionClass = 'border-slate-200 hover:border-teal-400 bg-white text-slate-800';

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

              {/* Rationale Section */}
              {showRationale && (
                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-800">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Official PNLE Rationale & Standards Citation</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentQ.rationale}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                    Ref: {currentQ.referenceStandard}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleResetQuiz}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Drill</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={!showRationale}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-40"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar: PNLE Readiness Gauge & 5-Subject Breakdown */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center justify-between">
                <span>PNLE Readiness Score</span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Passing: 75% (No rating below 60%)
                </span>
              </h4>

              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-teal-600"
                      strokeDasharray={`${user.pnleReadinessScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-slate-900">{user.pnleReadinessScore}%</span>
                    <span className="block text-[10px] text-slate-500 font-semibold uppercase">High Probability</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span>Questions Attempted Today:</span>
                  <span className="font-bold text-slate-900">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Correct Today:</span>
                  <span className="font-bold text-emerald-600">{score} ({answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0}%)</span>
                </div>
              </div>
            </div>

            {/* 5 Board Subjects Blueprint */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h4 className="font-extrabold text-sm text-slate-900 mb-2">
                5 Board Subjects (20% Each)
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                PRC Board of Nursing standard weights:
              </p>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'NP 1: Community Health Nursing', prog: 88 },
                  { name: 'NP 2: Maternal and Child Nursing', prog: 82 },
                  { name: 'NP 3: Care of Clients (Cellular & Acute)', prog: 78 },
                  { name: 'NP 4: Care of Clients (Neuro & Multi-System)', prog: 74 },
                  { name: 'NP 5: Psychiatric Nursing & Leadership', prog: 90 },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-slate-800">{s.name}</span>
                      <span className="font-bold text-teal-700">{s.prog}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${s.prog}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CHED Curriculum Explorer */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === year
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Year {year} Courses ({year === 1 ? 'Freshman' : year === 2 ? 'Sophomore' : year === 3 ? 'Junior' : 'Senior'})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHED_BSN_CURRICULUM.filter((c) => c.year === selectedYear).map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {course.code}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1">{course.title}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    Sem {course.semester}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {course.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Units: {course.lectureUnits} Lec / {course.labUnits} Lab</span>
                  <span className="font-semibold text-teal-700">RLE: {course.rleHours} Hours</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {course.competencyFocus.map((comp, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      ✓ {comp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: RLE Clinical Hours & Delivery Room Cases Tracker */}
      {activeTab === 'rle_tracker' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              CHED Mandated Clinical RLE Cases & Special Rotations
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              These verified cases are required for application to the Philippine Nurse Licensure Examination (PNLE) under PRC Resolution No. 2004-179.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHED_CLINICAL_REQUIREMENTS.map((item, idx) => {
                const percent = Math.min(100, Math.round((item.completedCount / item.requiredCount) * 100));
                const isComplete = item.completedCount >= item.requiredCount;

                return (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-slate-900">{item.category}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isComplete ? 'Complete' : 'In Progress'}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Requirement: {item.requiredCount}</span>
                      <span className="font-bold text-teal-800">{item.completedCount} Logged ({percent}%)</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-teal-600'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Hospital Level: {item.minimumLevel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 11 Core Competencies */}
      {activeTab === 'competencies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PHILIPPINE_NURSING_COMPETENCIES.map((comp) => (
            <div key={comp.code} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {comp.code}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{comp.title}</h4>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{comp.chedRef}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {comp.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700">Clinical Performance Indicators:</span>
                {comp.indicators.map((ind, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: International Curriculum Comparison */}
      {activeTab === 'intl_compare' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Philippine BSN vs. Global Nursing Standards Comparison
          </h3>
          <p className="text-xs text-slate-500">
            Why Philippine BSN graduates are among the most recruited nurses worldwide:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3">Domain</th>
                  <th className="p-3 text-teal-800">Philippine BSN (CHED)</th>
                  <th className="p-3">United States (BSN)</th>
                  <th className="p-3">United Kingdom (BSc)</th>
                  <th className="p-3">Australia (BN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold">Total Duration</td>
                  <td className="p-3 text-teal-800 font-bold">4 Full Years</td>
                  <td className="p-3">4 Years (or 2Y Accelerated)</td>
                  <td className="p-3">3 Years</td>
                  <td className="p-3">3 Years</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Clinical Hours</td>
                  <td className="p-3 text-teal-800 font-bold">2,142+ RLE Hours (Direct Patient)</td>
                  <td className="p-3">~700 – 1,000 Hours</td>
                  <td className="p-3">2,300 Hours (50% Theory / 50% Practice)</td>
                  <td className="p-3">800 – 1,000 Hours</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Operating & Delivery Cases</td>
                  <td className="p-3 text-teal-800 font-bold">Mandated: 5 Major, 5 Minor, 5 Deliveries, 5 Cord Care</td>
                  <td className="p-3">Observational / Unit Rotation</td>
                  <td className="p-3">Midwifery is a separate degree</td>
                  <td className="p-3">Observational</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Licensure Exam</td>
                  <td className="p-3 text-teal-800 font-bold">PNLE (500 items across 5 subjects)</td>
                  <td className="p-3">NCLEX-RN (85 - 150 items adaptive)</td>
                  <td className="p-3">NMC CBT (115 items) + 10-Station OSCE</td>
                  <td className="p-3">NCLEX-RN + OSCE (OBA)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
