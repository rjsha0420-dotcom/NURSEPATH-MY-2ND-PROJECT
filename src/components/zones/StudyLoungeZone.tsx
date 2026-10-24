import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RotateCw, 
  Brain, 
  Sparkles, 
  Clock, 
  Send, 
  CheckCircle2, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw,
  Layers,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { Flashcard, UserProfile } from '../../types';
import { calculateSM2, isCardDue } from '../../services/sm2Algorithm';
import { getFlashcards, saveFlashcards } from '../../services/storageService';
import { askClinicalTutor, generateFlashcardsAI, fetchClinicalCaseStudy, CaseStudyData } from '../../services/aiService';

interface StudyLoungeZoneProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const StudyLoungeZone: React.FC<StudyLoungeZoneProps> = ({ user, onOpenSubscription }) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'ai_tutor' | 'case_simulator' | 'pomodoro'>('flashcards');

  // Flashcards state
  const [cards, setCards] = useState<Flashcard[]>(getFlashcards());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);

  // AI Tutor chat state
  const [tutorMessages, setTutorMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: `Hello Nurse ${user.name.split(' ')[0]}! I am your NURSEPATH AI Clinical Tutor. Ask me any high-yield PNLE, NCLEX, or Masteral question, clinical drug dosage, or SBAR scenario. How can I assist your study session today?`,
      time: 'Just now'
    }
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Case Study simulator state
  const [caseStudy, setCaseStudy] = useState<CaseStudyData | null>(null);
  const [selectedCaseOption, setSelectedCaseOption] = useState<number | null>(null);
  const [showCaseRationale, setShowCaseRationale] = useState(false);
  const [isCaseLoading, setIsCaseLoading] = useState(false);

  // Pomodoro state
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [isPomoActive, setIsPomoActive] = useState(false);
  const [notesText, setNotesText] = useState('Key Clinical Notes:\n- Remember Beck\'s triad: Muffled heart sounds, JVD, Hypotension.\n- Allen test prior to ABG draw.\n- Heparin antidote: Protamine Sulfate.');

  useEffect(() => {
    let timer: any = null;
    if (isPomoActive) {
      timer = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(pomoSeconds - 1);
        } else if (pomoMinutes > 0) {
          setPomoMinutes(pomoMinutes - 1);
          setPomoSeconds(59);
        } else {
          setIsPomoActive(false);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPomoActive, pomoMinutes, pomoSeconds]);

  const currentCard = cards[currentCardIndex] || cards[0];

  const handleSM2Rating = (quality: number) => {
    if (!currentCard) return;
    const updatedStats = calculateSM2(currentCard, quality);
    const updatedCard: Flashcard = {
      ...currentCard,
      ...updatedStats,
    };

    const newCards = [...cards];
    newCards[currentCardIndex] = updatedCard;
    setCards(newCards);
    saveFlashcards(newCards);

    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % newCards.length);
  };

  const handleGenerateCardsAI = async () => {
    if (!aiTopicInput.trim()) return;
    setIsGeneratingCards(true);
    try {
      const generated = await generateFlashcardsAI(aiTopicInput);
      const combined = [...generated, ...cards];
      setCards(combined);
      saveFlashcards(combined);
      setAiTopicInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleSendTutorMessage = async () => {
    if (!tutorInput.trim() || isTutorLoading) return;
    const userMsg = tutorInput;
    setTutorInput('');
    setTutorMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    setIsTutorLoading(true);
    try {
      const reply = await askClinicalTutor(userMsg, { zone: 'Study Lounge' });
      setTutorMessages((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handleLoadNewCase = async () => {
    setIsCaseLoading(true);
    setSelectedCaseOption(null);
    setShowCaseRationale(false);
    try {
      const cs = await fetchClinicalCaseStudy('Critical Care & Cardiovascular');
      setCaseStudy(cs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCaseLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-amber-400/30 text-amber-200 border border-amber-300/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              📚 Zone 5: All-in-One Study Lounge & AI Engine
            </span>
            <span className="text-amber-300 text-xs font-semibold">SM-2 Spaced Repetition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            High-Yield Clinical Mastery with AI Clinical Guidance
          </h1>
          <p className="text-sm text-amber-100/90 mt-1 leading-relaxed">
            SuperMemo SM-2 memory retention engine, AI Clinical Tutor with SBAR rationale, Next-Generation NCLEX interactive case study simulations, and deep study Pomodoro focus mode.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'flashcards', label: '⚡ SM-2 Flashcards', badge: `${cards.length} Cards` },
          { id: 'ai_tutor', label: '🤖 AI Clinical Tutor', badge: 'Gemini-Powered' },
          { id: 'case_simulator', label: '🩺 NextGen Case Simulator', badge: 'SBAR Rationale' },
          { id: 'pomodoro', label: '⏱️ Deep Study & Pomodoro', badge: 'Focus Mode' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === tab.id ? 'bg-amber-700 text-amber-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: SM-2 Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Flashcard Card Container */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm min-h-[360px] flex flex-col justify-between relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  {currentCard.category}
                </span>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">
                    Card {currentCardIndex + 1} of {cards.length}
                  </span>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    EF: {currentCard.easeFactor} • Reps: {currentCard.reps}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="my-auto py-8 text-center cursor-pointer select-none space-y-4"
              >
                {!isFlipped ? (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Question (Tap to reveal Answer)
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed px-4">
                      {currentCard.front}
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fadeIn">
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block mb-1">
                      Validated Answer & Evidence
                    </span>
                    <p className="text-sm sm:text-base text-slate-800 whitespace-pre-line font-medium leading-relaxed px-4">
                      {currentCard.back}
                    </p>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 inline-block max-w-lg mt-2">
                      💡 <strong>High-Yield Pearl:</strong> {currentCard.pearl}
                    </div>
                  </div>
                )}
              </div>

              {/* SM-2 Quality Feedback Buttons */}
              <div className="pt-4 border-t border-slate-100">
                {!isFlipped ? (
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                  >
                    Reveal Answer & Evidence
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="text-center text-[11px] text-slate-500 font-semibold">
                      SuperMemo SM-2 Recall Quality (0 to 5):
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleSM2Rating(1)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        <span className="block font-black text-sm">1</span>
                        <span className="text-[10px]">Forgot (1d)</span>
                      </button>
                      <button
                        onClick={() => handleSM2Rating(3)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        <span className="block font-black text-sm">3</span>
                        <span className="text-[10px]">Hard</span>
                      </button>
                      <button
                        onClick={() => handleSM2Rating(4)}
                        className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        <span className="block font-black text-sm">4</span>
                        <span className="text-[10px]">Good</span>
                      </button>
                      <button
                        onClick={() => handleSM2Rating(5)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        <span className="block font-black text-sm">5</span>
                        <span className="text-[10px]">Easy</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Generator Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="font-extrabold text-sm text-slate-900">AI Flashcard Generator</h4>
              </div>
              <p className="text-xs text-slate-500">
                Generate high-yield cards tagged to evidence levels (e.g. Magnesium Sulfate toxicity, Acid-base imbalances, Orem's theory):
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter medical topic..."
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleGenerateCardsAI}
                  disabled={isGeneratingCards}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingCards ? 'Generating Cards...' : 'Generate 3 High-Yield Cards'}
                </button>
              </div>
            </div>

            {/* SM-2 Algorithm Explanation */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                About SuperMemo SM-2
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                NURSEPATH implements the mathematical SM-2 spaced repetition algorithm. Cards rated &quot;Hard&quot; or &quot;Forgot&quot; appear again promptly; &quot;Easy&quot; cards expand exponentially, guaranteeing long-term board exam retention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Clinical Tutor */}
      {activeTab === 'ai_tutor' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[580px]">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
                <Brain className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm">NURSEPATH AI Clinical Tutor</h4>
                <p className="text-[11px] text-slate-300">Grounded in CHED CMO 15 s.2017 & NCSBN NGN standards</p>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
              Active Session
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {tutorMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-blue-900 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            {isTutorLoading && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 italic">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>AI Tutor is formulating evidence-based clinical guidance...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask a clinical question (e.g. Difference between Neuroleptic Malignant Syndrome and Serotonin Syndrome?)..."
              value={tutorInput}
              onChange={(e) => setTutorInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTutorMessage()}
              className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSendTutorMessage}
              disabled={isTutorLoading}
              className="bg-blue-900 hover:bg-blue-950 text-white p-2.5 rounded-xl cursor-pointer shadow-xs disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: NextGen Case Simulator */}
      {activeTab === 'case_simulator' && (
        <div className="space-y-4">
          {!caseStudy ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Interactive Next-Gen Clinical Case Study Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Simulate authentic clinical encounters featuring real-time vital sign trends, laboratory findings, and SBAR decision-making.
              </p>
              <button
                onClick={handleLoadNewCase}
                disabled={isCaseLoading}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {isCaseLoading ? 'Generating Scenario...' : 'Launch Case Study'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    NextGen Clinical Simulation
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base mt-1">{caseStudy.patientProfile}</h4>
                  <p className="text-xs text-slate-500">Chief Complaint: {caseStudy.chiefComplaint}</p>
                </div>
                <button
                  onClick={handleLoadNewCase}
                  className="text-xs text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Generate Another Case →
                </button>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">BP</span>
                  <span className="font-black text-slate-900">{caseStudy.vitalSigns.bp}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">HR</span>
                  <span className="font-black text-rose-600">{caseStudy.vitalSigns.hr}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">RR</span>
                  <span className="font-black text-slate-900">{caseStudy.vitalSigns.rr}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Temp</span>
                  <span className="font-black text-slate-900">{caseStudy.vitalSigns.temp}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">SpO2</span>
                  <span className="font-black text-rose-600">{caseStudy.vitalSigns.spo2}</span>
                </div>
              </div>

              {/* Labs & Scenario Narrative */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800">Labs & Diagnostic Findings:</span>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {caseStudy.labsAndDiagnostics.map((l, idx) => (
                    <li key={idx}>{l}</li>
                  ))}
                </ul>
                <p className="text-slate-700 pt-2 border-t border-slate-200/80 leading-relaxed">
                  <strong>Assessment Note:</strong> {caseStudy.clinicalScenario}
                </p>
              </div>

              {/* Priority Question */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">{caseStudy.question}</h4>
                <div className="space-y-2">
                  {caseStudy.options.map((opt, idx) => {
                    const isSelected = selectedCaseOption === idx;
                    const isCorrect = idx === caseStudy.correctIndex;
                    let style = 'border-slate-200 bg-white hover:border-teal-500';

                    if (showCaseRationale) {
                      if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                      else if (isSelected) style = 'border-rose-400 bg-rose-50';
                      else style = 'border-slate-200 opacity-60';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedCaseOption(idx);
                          setShowCaseRationale(true);
                        }}
                        disabled={showCaseRationale}
                        className={`w-full text-left p-3 rounded-xl border-2 text-xs flex items-start space-x-2.5 cursor-pointer ${style}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SBAR Rationale */}
              {showCaseRationale && (
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs space-y-2 animate-fadeIn">
                  <span className="font-bold text-teal-900 text-xs block">Official SBAR Clinical Rationale:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div className="p-2 bg-white rounded-lg border border-teal-100">
                      <strong>S (Situation):</strong> {caseStudy.sbarRationale.situation}
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-teal-100">
                      <strong>B (Background):</strong> {caseStudy.sbarRationale.background}
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-teal-100">
                      <strong>A (Assessment):</strong> {caseStudy.sbarRationale.assessment}
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-teal-100">
                      <strong>R (Recommendation):</strong> {caseStudy.sbarRationale.recommendation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Pomodoro & Deep Study */}
      {activeTab === 'pomodoro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-5">
            <h3 className="font-extrabold text-base text-slate-900">
              Nursing Deep Study Pomodoro
            </h3>
            <p className="text-xs text-slate-500">
              Optimal 25-minute study intervals proven to prevent cognitive fatigue during intensive board review.
            </p>

            <div className="text-5xl font-black text-slate-900 font-mono tracking-wider py-4">
              {String(pomoMinutes).padStart(2, '0')}:{String(pomoSeconds).padStart(2, '0')}
            </div>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setIsPomoActive(!isPomoActive)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 text-white shadow-xs cursor-pointer ${
                  isPomoActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                {isPomoActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPomoActive ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPomoActive(false);
                  setPomoMinutes(25);
                  setPomoSeconds(0);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col">
            <h4 className="font-extrabold text-sm text-slate-900">
              Active Session Scratchpad & Clinical Pearls
            </h4>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="flex-1 w-full p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-amber-500 resize-none min-h-[160px]"
            />
            <span className="text-[10px] text-slate-400">Notes auto-save locally to your browser storage.</span>
          </div>
        </div>
      )}
    </div>
  );
};
