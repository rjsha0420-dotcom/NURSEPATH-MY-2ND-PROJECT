import React, { useState } from 'react';
import { 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  FileText, 
  Calculator, 
  Clock, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Download, 
  Award,
  Sparkles,
  HeartPulse,
  Brain,
  Activity
} from 'lucide-react';
import { SPECIALTY_REVIEWERS, CLINICAL_DRUGS, CLINICAL_LABS, MOCK_CPD_RECORDS } from '../../data/mockClinicalTools';
import { UserProfile, CarePlan, CPDRecord } from '../../types';
import { getCarePlans, saveCarePlan, getCPDRecords, saveCPDRecord } from '../../services/storageService';

interface PractitionerZoneProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const PractitionerZone: React.FC<PractitionerZoneProps> = ({ user, onOpenSubscription }) => {
  const [activeTab, setActiveTab] = useState<'specialties' | 'drug_guide' | 'lab_values' | 'abg_interpreter' | 'care_plans' | 'calculators' | 'cpd_tracker'>('drug_guide');
  
  // Search & Filter state
  const [drugSearch, setDrugSearch] = useState('');
  const [labSearch, setLabSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(SPECIALTY_REVIEWERS[0]);

  // ABG Calculator state
  const [abgPh, setAbgPh] = useState<string>('7.31');
  const [abgPaco2, setAbgPaco2] = useState<string>('48');
  const [abgHco3, setAbgHco3] = useState<string>('24');
  const [abgPao2, setAbgPao2] = useState<string>('88');

  // Care Plans state
  const [carePlansList, setCarePlansList] = useState<CarePlan[]>(getCarePlans());
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newRelatedTo, setNewRelatedTo] = useState('');
  const [newAsEvidenced, setNewAsEvidenced] = useState('');
  const [newPatient, setNewPatient] = useState('');
  const [isCreatingCarePlan, setIsCreatingCarePlan] = useState(false);

  // Clinical Calculators state
  const [calcType, setCalcType] = useState<'drip' | 'parkland' | 'map' | 'gcs' | 'pedia_dose'>('drip');
  // Drip rate inputs
  const [dripVolume, setDripVolume] = useState('1000');
  const [dripTimeHours, setDripTimeHours] = useState('8');
  const [dropFactor, setDropFactor] = useState('15'); // 10, 15, 20, 60
  // Parkland inputs
  const [burnWeight, setBurnWeight] = useState('70');
  const [burnTbsa, setBurnTbsa] = useState('36');
  // MAP inputs
  const [mapSbp, setMapSbp] = useState('110');
  const [mapDbp, setMapDbp] = useState('70');
  // GCS inputs
  const [gcsEye, setGcsEye] = useState('4');
  const [gcsVerbal, setGcsVerbal] = useState('5');
  const [gcsMotor, setGcsMotor] = useState('6');
  // Pediatric dose
  const [pediaWeight, setPediaWeight] = useState('14');
  const [pediaDosePerKg, setPediaDosePerKg] = useState('20');

  // CPD state
  const [cpdList, setCpdList] = useState<CPDRecord[]>(getCPDRecords());

  // ABG Interpretation Logic
  const interpretABG = () => {
    const ph = parseFloat(abgPh);
    const co2 = parseFloat(abgPaco2);
    const hco3 = parseFloat(abgHco3);

    if (isNaN(ph) || isNaN(co2) || isNaN(hco3)) {
      return { interpretation: 'Enter valid numeric values', severity: 'normal', rule: '' };
    }

    const isAcidemic = ph < 7.35;
    const isAlkalemic = ph > 7.45;
    const isNormalPh = ph >= 7.35 && ph <= 7.45;

    const highCo2 = co2 > 45;
    const lowCo2 = co2 < 35;
    const highHco3 = hco3 > 26;
    const lowHco3 = hco3 < 22;

    let res = '';
    let severity = 'warning';

    if (isAcidemic) {
      if (highCo2 && !lowHco3) {
        res = 'Uncompensated Respiratory Acidosis (e.g. Hypoventilation, COPD, Opioid Overdose)';
      } else if (lowHco3 && !highCo2) {
        res = 'Uncompensated Metabolic Acidosis (e.g. DKA, Lactic Acidosis, Renal Failure)';
      } else if (highCo2 && highHco3) {
        res = 'Partially Compensated Respiratory Acidosis (Kidneys retaining HCO3 to buffer)';
      } else if (lowHco3 && lowCo2) {
        res = 'Partially Compensated Metabolic Acidosis (Lungs hyperventilating Kussmaul to blow off CO2)';
      } else {
        res = 'Combined Respiratory & Metabolic Acidosis (Cardiorespiratory Arrest / Severe Sepsis)';
        severity = 'critical';
      }
    } else if (isAlkalemic) {
      if (lowCo2 && !highHco3) {
        res = 'Uncompensated Respiratory Alkalosis (e.g. Hyperventilation, Acute Anxiety, Early Asthma)';
      } else if (highHco3 && !lowCo2) {
        res = 'Uncompensated Metabolic Alkalosis (e.g. Severe Vomiting, Nasogastric Suctioning, Diuretics)';
      } else if (lowCo2 && lowHco3) {
        res = 'Partially Compensated Respiratory Alkalosis';
      } else if (highHco3 && highCo2) {
        res = 'Partially Compensated Metabolic Alkalosis';
      } else {
        res = 'Mixed Alkalosis';
      }
    } else if (isNormalPh) {
      if (highCo2 && highHco3) {
        res = ph < 7.40 
          ? 'Fully Compensated Respiratory Acidosis (Chronic Lung Disease Baseline)' 
          : 'Fully Compensated Metabolic Alkalosis';
      } else if (lowCo2 && lowHco3) {
        res = ph < 7.40 
          ? 'Fully Compensated Metabolic Acidosis' 
          : 'Fully Compensated Respiratory Alkalosis';
      } else {
        res = 'Normal Arterial Blood Gas Parameters';
        severity = 'normal';
      }
    }

    return {
      interpretation: res,
      severity,
      rule: 'ROME: Respiratory Opposite (pH & PaCO2 opposite direction) | Metabolic Equal (pH & HCO3 same direction)'
    };
  };

  const abgResult = interpretABG();

  // Drip rate computation: (Volume in mL * Drop Factor) / (Time in Minutes)
  const calcDripRate = () => {
    const vol = parseFloat(dripVolume);
    const hrs = parseFloat(dripTimeHours);
    const df = parseFloat(dropFactor);
    if (!vol || !hrs || !df) return 0;
    const rate = Math.round((vol * df) / (hrs * 60));
    return rate;
  };

  // Parkland Formula: 4 mL * Weight (kg) * % TBSA
  const calcParkland = () => {
    const wt = parseFloat(burnWeight);
    const tbsa = parseFloat(burnTbsa);
    if (!wt || !tbsa) return { total: 0, first8: 0, next16: 0, hourlyFirst8: 0 };
    const total = 4 * wt * tbsa;
    const first8 = total / 2;
    const next16 = total / 2;
    const hourlyFirst8 = Math.round(first8 / 8);
    return { total, first8, next16, hourlyFirst8 };
  };

  // MAP Computation: (2*DBP + SBP) / 3
  const calcMap = () => {
    const sbp = parseFloat(mapSbp);
    const dbp = parseFloat(mapDbp);
    if (!sbp || !dbp) return 0;
    return Math.round((2 * dbp + sbp) / 3);
  };

  // GCS Total: Eye (1-4) + Verbal (1-5) + Motor (1-6)
  const calcGcs = () => {
    const e = parseInt(gcsEye, 10);
    const v = parseInt(gcsVerbal, 10);
    const m = parseInt(gcsMotor, 10);
    const tot = e + v + m;
    let label = 'Minor/Mild (13-15)';
    if (tot <= 8) label = 'Severe Head Injury / Coma (GCS <= 8 Intubate!)';
    else if (tot <= 12) label = 'Moderate Brain Injury (9-12)';
    return { tot, label };
  };

  const handleSaveCarePlan = () => {
    if (!newDiagnosis || !newPatient) return;
    const plan: CarePlan = {
      id: 'cp-' + Date.now(),
      patientProfile: newPatient,
      nandaDiagnosis: newDiagnosis,
      relatedTo: newRelatedTo || 'Underlying pathophysiology',
      asEvidencedBy: newAsEvidenced || 'Objective and subjective signs',
      nocOutcomes: ['Patient will demonstrate stable vitals and absence of complications within 48 hours.'],
      nicInterventions: [
        { action: 'Assess vital signs and focused physical examination every 4 hours.', rationale: 'Detects early deterioration.' },
        { action: 'Administer prescribed medications as ordered adhering to rights.', rationale: 'Therapeutic resolution of etiology.' }
      ],
      evaluationCriteria: 'Client achieves target clinical benchmarks without adverse events.',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    saveCarePlan(plan);
    setCarePlansList(getCarePlans());
    setIsCreatingCarePlan(false);
    setNewDiagnosis('');
    setNewRelatedTo('');
    setNewAsEvidenced('');
    setNewPatient('');
  };

  const filteredDrugs = CLINICAL_DRUGS.filter((d) => 
    d.genericName.toLowerCase().includes(drugSearch.toLowerCase()) ||
    d.drugClass.toLowerCase().includes(drugSearch.toLowerCase()) ||
    d.indications.toLowerCase().includes(drugSearch.toLowerCase())
  );

  const filteredLabs = CLINICAL_LABS.filter((l) =>
    l.name.toLowerCase().includes(labSearch.toLowerCase()) ||
    l.category.toLowerCase().includes(labSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              🏥 Zone 3: Practitioner & Clinical Excellence
            </span>
            <span className="text-teal-300 text-xs font-semibold">Hospital Tools & 10 Specialties</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Advanced Clinical Tools, Drug Guide & 10 Specialty Certifications
          </h1>
          <p className="text-sm text-teal-100/90 mt-1 leading-relaxed">
            Essential point-of-care references for bedside nurses: high-alert drug monographs, real-time Arterial Blood Gas interpreter, critical lab alert thresholds, NANDA-I Care Plan Builder, and validated clinical calculators.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'drug_guide', label: '💊 High-Alert Drug Guide', badge: 'Push Rates & Antidotes' },
          { id: 'abg_interpreter', label: '🧪 ABG Interpreter', badge: 'ROME Rule' },
          { id: 'lab_values', label: '📊 Lab Values & Critical Alerts', badge: 'Normal & SI' },
          { id: 'calculators', label: '🧮 Clinical Calculators', badge: 'IV / Parkland / MAP' },
          { id: 'care_plans', label: '📝 Care Plan Builder', badge: 'NANDA-I / NIC / NOC' },
          { id: 'specialties', label: '🎖️ 10 Specialty Certifications', badge: 'CCRN / CEN / CPN' },
          { id: 'cpd_tracker', label: '📈 CPD Units Tracker', badge: 'PRC & International' },
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

      {/* Tab 1: High-Alert Drug Guide */}
      {activeTab === 'drug_guide' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search high-alert drug by generic name, class, or indication (e.g. Norepinephrine, Heparin, Insulin, Digoxin)..."
              value={drugSearch}
              onChange={(e) => setDrugSearch(e.target.value)}
              className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrugs.map((drug) => (
              <div key={drug.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{drug.genericName}</h4>
                      {drug.highAlert && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-rose-200">
                          High Alert
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Brands: {drug.brandNames.join(', ')} • {drug.drugClass}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    Pregnancy: {drug.pregnancyCategory}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <div><strong>Standard Dosing:</strong> {drug.standardDose}</div>
                  <div className="text-blue-900"><strong>IV Administration:</strong> {drug.ivAdministration.pushRate}</div>
                  <div><strong>Dilution:</strong> {drug.ivAdministration.dilution}</div>
                </div>

                {drug.antidote && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-900 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div><strong>Antidote / Reversal:</strong> {drug.antidote}</div>
                  </div>
                )}

                {drug.blackBoxWarning && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-900 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div><strong>Black Box Warning:</strong> {drug.blackBoxWarning}</div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-800 text-[11px]">Priority Nursing Considerations:</span>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                    {drug.nursingConsiderations.map((nc, idx) => (
                      <li key={idx}>{nc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: ABG Interpreter */}
      {activeTab === 'abg_interpreter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Arterial Blood Gas Input
            </h3>
            <p className="text-xs text-slate-500">
              Enter patient laboratory blood gas values to instantly diagnose acid-base imbalance and compensation:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Arterial pH (Normal: 7.35 – 7.45)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={abgPh}
                  onChange={(e) => setAbgPh(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  PaCO2 Respiratory Component (Normal: 35 – 45 mmHg)
                </label>
                <input
                  type="number"
                  value={abgPaco2}
                  onChange={(e) => setAbgPaco2(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  HCO3 Metabolic Component (Normal: 22 – 26 mEq/L)
                </label>
                <input
                  type="number"
                  value={abgHco3}
                  onChange={(e) => setAbgHco3(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  PaO2 Oxygenation (Normal: 80 – 100 mmHg)
                </label>
                <input
                  type="number"
                  value={abgPao2}
                  onChange={(e) => setAbgPao2(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Real-time algorithmic ROME evaluation</span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Clinical Diagnostic Interpretation
              </span>

              <div className={`p-4 rounded-xl border-2 ${
                abgResult.severity === 'critical' 
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : abgResult.severity === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}>
                <div className="text-lg font-black">{abgResult.interpretation}</div>
                <div className="text-xs font-semibold mt-1 opacity-90">{abgResult.rule}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">pH Status</span>
                  <span className={`text-base font-black ${
                    parseFloat(abgPh) < 7.35 ? 'text-rose-600' : parseFloat(abgPh) > 7.45 ? 'text-blue-600' : 'text-emerald-600'
                  }`}>
                    {parseFloat(abgPh) < 7.35 ? 'Acidemia' : parseFloat(abgPh) > 7.45 ? 'Alkalemia' : 'Normal'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">PaCO2</span>
                  <span className={`text-base font-black ${
                    parseFloat(abgPaco2) > 45 ? 'text-rose-600' : parseFloat(abgPaco2) < 35 ? 'text-blue-600' : 'text-emerald-600'
                  }`}>
                    {parseFloat(abgPaco2) > 45 ? 'Acidic (>45)' : parseFloat(abgPaco2) < 35 ? 'Alkaline (<35)' : 'Normal'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">HCO3</span>
                  <span className={`text-base font-black ${
                    parseFloat(abgHco3) < 22 ? 'text-rose-600' : parseFloat(abgHco3) > 26 ? 'text-blue-600' : 'text-emerald-600'
                  }`}>
                    {parseFloat(abgHco3) < 22 ? 'Acidic (<22)' : parseFloat(abgHco3) > 26 ? 'Alkaline (>26)' : 'Normal'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Hypoxemia</span>
                  <span className={`text-base font-black ${
                    parseFloat(abgPao2) < 80 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {parseFloat(abgPao2) < 60 ? 'Severe' : parseFloat(abgPao2) < 80 ? 'Mild/Mod' : 'None'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800">Priority Clinical Interventions:</span>
                <p className="text-slate-600 leading-relaxed">
                  {parseFloat(abgPh) < 7.35 && parseFloat(abgPaco2) > 45
                    ? 'Improve alveolar ventilation. Check airway patency, titrate BiPAP/mechanical ventilation rate and tidal volume. Position patient in High Fowler. If opioid-induced, prepare Naloxone.'
                    : parseFloat(abgPh) < 7.35 && parseFloat(abgHco3) < 22
                    ? 'Address underlying metabolic cause. For DKA: start IV Regular insulin and fluid rehydration. For lactic acidosis: fluid resuscitate shock state. Monitor serum potassium closely.'
                    : 'Maintain current respiratory therapy and recheck arterial blood gas in 2-4 hours or post ventilator setting adjustment.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Lab Values & Critical Alerts */}
      {activeTab === 'lab_values' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search lab tests (e.g. Potassium, Troponin, Sodium, CBC, Coagulation)..."
              value={labSearch}
              onChange={(e) => setLabSearch(e.target.value)}
              className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLabs.map((lab) => (
              <div key={lab.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{lab.name}</h4>
                    <span className="text-xs text-slate-500 font-medium">Category: {lab.category}</span>
                  </div>
                  <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                    Conventional: {lab.conventionalRange}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                    <span className="block font-bold text-[10px] uppercase text-rose-700">Panic Critical Low</span>
                    <span className="font-extrabold">{lab.criticalLow}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                    <span className="block font-bold text-[10px] uppercase text-rose-700">Panic Critical High</span>
                    <span className="font-extrabold">{lab.criticalHigh}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950">
                  <strong>Priority Clinical Alert:</strong> {lab.priorityAlert}
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-800 text-[11px]">Bedside Nursing Implications:</span>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                    {lab.nursingImplications.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Clinical Calculators */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Choose Clinical Calculator
            </span>
            {[
              { id: 'drip', name: 'IV Drip Rate (gtt/min)', icon: Activity },
              { id: 'parkland', name: 'Parkland Burn Fluid Resuscitation', icon: HeartPulse },
              { id: 'map', name: 'Mean Arterial Pressure (MAP)', icon: Stethoscope },
              { id: 'gcs', name: 'Glasgow Coma Scale (GCS)', icon: Brain },
              { id: 'pedia_dose', name: 'Pediatric Dose (mg/kg)', icon: Pill },
            ].map((calc) => {
              const Icon = calc.icon;
              const isSelected = calcType === calc.id;
              return (
                <button
                  key={calc.id}
                  onClick={() => setCalcType(calc.id as any)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/80 text-blue-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-blue-700" />
                  <span className="text-xs">{calc.name}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              {calcType === 'drip' && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900">
                    IV Infusion Drip Rate Calculator (gtt/min)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Total Volume (mL)</label>
                      <input
                        type="number"
                        value={dripVolume}
                        onChange={(e) => setDripVolume(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Time to Infuse (Hours)</label>
                      <input
                        type="number"
                        value={dripTimeHours}
                        onChange={(e) => setDripTimeHours(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Drop Factor (gtt/mL)</label>
                      <select
                        value={dropFactor}
                        onChange={(e) => setDropFactor(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      >
                        <option value="10">10 gtt/mL (Macro)</option>
                        <option value="15">15 gtt/mL (Standard Macro)</option>
                        <option value="20">20 gtt/mL (Macro)</option>
                        <option value="60">60 gtt/mL (Microdrip / Pedia)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-center">
                    <span className="text-xs text-teal-800 font-bold uppercase block">Calculated Drip Rate</span>
                    <span className="text-3xl font-black text-teal-900">{calcDripRate()} gtt / min</span>
                    <span className="block text-xs text-teal-700 mt-1">
                      Infusion Pump Rate: {(parseFloat(dripVolume) / parseFloat(dripTimeHours)).toFixed(1)} mL / hr
                    </span>
                  </div>
                </div>
              )}

              {calcType === 'parkland' && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Parkland Burn Fluid Resuscitation Formula (Lactated Ringer's)
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Patient Weight (kg)</label>
                      <input
                        type="number"
                        value={burnWeight}
                        onChange={(e) => setBurnWeight(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">% Total Body Surface Area (% TBSA)</label>
                      <input
                        type="number"
                        value={burnTbsa}
                        onChange={(e) => setBurnTbsa(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {(() => {
                    const p = calcParkland();
                    return (
                      <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                          <span className="text-xs text-blue-800 font-bold uppercase block">Total 24-Hour Crystalloid Requirement</span>
                          <span className="text-3xl font-black text-blue-900">{p.total.toLocaleString()} mL</span>
                          <span className="block text-xs text-blue-700">Formula: 4 mL × {burnWeight} kg × {burnTbsa}% TBSA</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <span className="font-bold text-slate-800 block">First 8 Hours (50%)</span>
                            <span className="text-lg font-black text-teal-800">{p.first8.toLocaleString()} mL</span>
                            <span className="block text-[11px] text-slate-500">Rate: {p.hourlyFirst8} mL / hr</span>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <span className="font-bold text-slate-800 block">Remaining 16 Hours (50%)</span>
                            <span className="text-lg font-black text-teal-800">{p.next16.toLocaleString()} mL</span>
                            <span className="block text-[11px] text-slate-500">Rate: {Math.round(p.next16 / 16)} mL / hr</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {calcType === 'map' && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Mean Arterial Pressure (MAP)
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Systolic Blood Pressure (SBP)</label>
                      <input
                        type="number"
                        value={mapSbp}
                        onChange={(e) => setMapSbp(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Diastolic Blood Pressure (DBP)</label>
                      <input
                        type="number"
                        value={mapDbp}
                        onChange={(e) => setMapDbp(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center">
                    <span className="text-xs text-indigo-800 font-bold uppercase block">Calculated MAP</span>
                    <span className="text-3xl font-black text-indigo-950">{calcMap()} mmHg</span>
                    <span className="block text-xs text-indigo-700 mt-1">
                      {calcMap() >= 65 
                        ? 'Adequate organ and cerebral perfusion pressure (MAP >= 65 mmHg)'
                        : 'Hypoperfusion warning! Critical threshold: MAP must be >= 65 mmHg'}
                    </span>
                  </div>
                </div>
              )}

              {calcType === 'gcs' && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Glasgow Coma Scale (GCS) Score
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Eye Opening (1-4)</label>
                      <select
                        value={gcsEye}
                        onChange={(e) => setGcsEye(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="4">4 - Spontaneous</option>
                        <option value="3">3 - To sound / speech</option>
                        <option value="2">2 - To pressure / pain</option>
                        <option value="1">1 - None</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Verbal Response (1-5)</label>
                      <select
                        value={gcsVerbal}
                        onChange={(e) => setGcsVerbal(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="5">5 - Oriented</option>
                        <option value="4">4 - Confused</option>
                        <option value="3">3 - Inappropriate words</option>
                        <option value="2">2 - Incomprehensible sounds</option>
                        <option value="1">1 - None</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Motor Response (1-6)</label>
                      <select
                        value={gcsMotor}
                        onChange={(e) => setGcsMotor(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="6">6 - Obeys commands</option>
                        <option value="5">5 - Localizing to pain</option>
                        <option value="4">4 - Normal flexion (withdrawal)</option>
                        <option value="3">3 - Abnormal flexion (decorticate)</option>
                        <option value="2">2 - Extension (decerebrate)</option>
                        <option value="1">1 - None (flaccid)</option>
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const g = calcGcs();
                    return (
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
                        <span className="text-xs text-purple-800 font-bold uppercase block">Total GCS Score</span>
                        <span className="text-3xl font-black text-purple-950">{g.tot} / 15</span>
                        <span className="block text-xs font-bold text-purple-700 mt-1">{g.label}</span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {calcType === 'pedia_dose' && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Pediatric Weight-Based Dosage Calculator
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Child's Weight (kg)</label>
                      <input
                        type="number"
                        value={pediaWeight}
                        onChange={(e) => setPediaWeight(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Dose Ordered (mg / kg / dose)</label>
                      <input
                        type="number"
                        value={pediaDosePerKg}
                        onChange={(e) => setPediaDosePerKg(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-center">
                    <span className="text-xs text-teal-800 font-bold uppercase block">Single Calculated Dose</span>
                    <span className="text-3xl font-black text-teal-900">
                      {(parseFloat(pediaWeight) * parseFloat(pediaDosePerKg)).toFixed(1)} mg
                    </span>
                    <span className="block text-xs text-teal-700 mt-1">
                      Always independently double-check against maximum single adult dose.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Care Plan Builder */}
      {activeTab === 'care_plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              NANDA-I, NIC & NOC Clinical Care Plans
            </h3>
            <button
              onClick={() => setIsCreatingCarePlan(!isCreatingCarePlan)}
              className="bg-blue-900 hover:bg-blue-950 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreatingCarePlan ? 'Cancel' : 'Create New Care Plan'}</span>
            </button>
          </div>

          {isCreatingCarePlan && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-600">New Evidence-Based Care Plan</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Profile & Condition</label>
                  <input
                    type="text"
                    placeholder="e.g. 54yo male post-op total hip arthroplasty day 1"
                    value={newPatient}
                    onChange={(e) => setNewPatient(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NANDA-I Nursing Diagnosis</label>
                  <input
                    type="text"
                    placeholder="e.g. Acute Pain related to surgical incision and tissue trauma"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Related To (Etiology)</label>
                    <input
                      type="text"
                      placeholder="e.g. Biological injury agent / incision"
                      value={newRelatedTo}
                      onChange={(e) => setNewRelatedTo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">As Evidenced By (Defining Characteristics)</label>
                    <input
                      type="text"
                      placeholder="e.g. Numeric pain score 8/10, facial grimacing, tachycardia"
                      value={newAsEvidenced}
                      onChange={(e) => setNewAsEvidenced(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveCarePlan}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  Save to Patient Chart
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {carePlansList.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Standardized Care Plan
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1">{plan.nandaDiagnosis}</h4>
                    <p className="text-xs text-slate-500">{plan.patientProfile}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{plan.createdAt}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-1">NOC Nursing Outcomes:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      {plan.nocOutcomes.map((noc, idx) => (
                        <li key={idx}>{noc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-1">NIC Priority Interventions:</span>
                    <ul className="space-y-1.5 text-slate-600">
                      {plan.nicInterventions.map((nic, idx) => (
                        <li key={idx}>
                          <span className="font-semibold text-slate-800">• {nic.action}</span>
                          <span className="block text-[10px] text-teal-800 pl-3">Rationale: {nic.rationale}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500">
                  <strong>Evaluation:</strong> {plan.evaluationCriteria}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: 10 Specialty Certifications */}
      {activeTab === 'specialties' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              10 Specialty Certification Reviews
            </span>
            {SPECIALTY_REVIEWERS.map((spec) => {
              const isSelected = selectedSpecialty.id === spec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`w-full p-3 rounded-xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/70 text-blue-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <Award className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">{spec.acronym} — {spec.name}</div>
                    <div className="text-[10px] text-slate-500">{spec.boardAgency}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    {selectedSpecialty.acronym} Certification Review
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-2">{selectedSpecialty.name}</h3>
                  <p className="text-xs text-slate-500">{selectedSpecialty.boardAgency} • {selectedSpecialty.credentialLevel}</p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                  {selectedSpecialty.sampleQuestionsCount} Question Bank
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedSpecialty.description}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800">High-Yield Core Specialty Domains:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSpecialty.keyTopics.map((topic, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="text-slate-800 font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Included in Nurse Specialist & Nurse Scholar Tiers
                </span>
                <button
                  onClick={onOpenSubscription}
                  className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  Start Full Specialty Mock Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: CPD Tracker */}
      {activeTab === 'cpd_tracker' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Continuing Professional Development (CPD) Unit Tracker
                </h3>
                <p className="text-xs text-slate-500">
                  Track requirements for Philippine Regulation Commission (PRC) license renewal (RA 10912 CPD Law) and international revalidation (UK NMC 3-year 35h CPD / AHPRA 20h annual CPD).
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Total Validated CPD Units:</span>
                <div className="text-2xl font-black text-teal-800">{user.cpdUnitsCompleted} Units</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50">
                <span className="text-xs font-bold text-teal-900 block">🇵🇭 PRC RN License Renewal</span>
                <span className="text-lg font-black text-teal-900">15 Units Required</span>
                <span className="block text-[11px] text-teal-700 mt-1">Every 3 years for PRC PIC card</span>
              </div>
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <span className="text-xs font-bold text-blue-900 block">🇬🇧 UK NMC Revalidation</span>
                <span className="text-lg font-black text-blue-900">35 CPD Hours</span>
                <span className="block text-[11px] text-blue-700 mt-1">Including 20 participatory hours</span>
              </div>
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
                <span className="text-xs font-bold text-purple-900 block">🇦🇺 AHPRA NMBA CPD</span>
                <span className="text-lg font-black text-purple-900">20 Hours Annual</span>
                <span className="block text-[11px] text-purple-700 mt-1">Audited annual registration cycle</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-800">Completed Accredited CPD Records:</span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {cpdList.map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-white flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-900">{rec.title}</h5>
                      <span className="text-slate-500 text-[11px]">Provider: {rec.provider} • Date: {rec.dateCompleted}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-teal-800 text-sm">+{rec.units} Units</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{rec.certificateRef}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
