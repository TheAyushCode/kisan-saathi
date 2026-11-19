import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Calculator,
  CheckCircle2,
  ExternalLink,
  IndianRupee,
  FileText,
  Sparkles,
  Users,
  Tractor,
} from 'lucide-react';

// बिहार कृषि विभाग (SMAM / राज्य योजना) के अंतर्गत प्रमुख यंत्र और अनुदान दरें
const SUBSIDY_MACHINES = [
  {
    id: 'rotavator',
    name: 'रोटावेटर (Rotavator - 6/7 Feet)',
    approxCost: 110000,
    generalSubsidyPercent: 40,
    generalMaxCap: 44000,
    scStSubsidyPercent: 50,
    scStMaxCap: 55000,
    chcSubsidyPercent: 80,
    chcMaxCap: 88000,
    documents: ['किसान पंजीकरण संख्या (DBT ID)', 'आधार कार्ड एवं बैंक पासबुक', 'जमीन की रसीद (LPC / मालगुजारी रसीद)', 'यंत्र विक्रेता का पक्का बिल (GST Invoice)'],
  },
  {
    id: 'laser_leveler',
    name: 'लेजर लैंड लेवलर (Laser Land Leveler)',
    approxCost: 350000,
    generalSubsidyPercent: 40,
    generalMaxCap: 140000,
    scStSubsidyPercent: 50,
    scStMaxCap: 175000,
    chcSubsidyPercent: 80,
    chcMaxCap: 280000,
    documents: ['किसान पंजीकरण संख्या (DBT ID)', 'ट्रैक्टर की आरसी (RC Book - 35 HP से अधिक)', 'जमीन की अद्यतन रसीद', 'आधार व बैंक पासबुक'],
  },
  {
    id: 'happy_seeder',
    name: 'हैप्पी सीडर / सुपर सीडर (Happy / Super Seeder)',
    approxCost: 220000,
    generalSubsidyPercent: 50,
    generalMaxCap: 110000,
    scStSubsidyPercent: 60,
    scStMaxCap: 132000,
    chcSubsidyPercent: 80,
    chcMaxCap: 176000,
    documents: ['किसान पंजीकरण संख्या (DBT ID)', 'फसल अवशेष प्रबंधन (CRM) घोषणा पत्र', 'ट्रैक्टर RC बुक', 'जमीन की रसीद'],
  },
  {
    id: 'reaper_binder',
    name: 'रीपर कम बाइंडर (Reaper cum Binder)',
    approxCost: 320000,
    generalSubsidyPercent: 40,
    generalMaxCap: 128000,
    scStSubsidyPercent: 50,
    scStMaxCap: 160000,
    chcSubsidyPercent: 80,
    chcMaxCap: 256000,
    documents: ['किसान पंजीकरण संख्या (DBT ID)', 'आधार कार्ड एवं बैंक खाता विवरण', 'जमीन की रसीद (LPC)', 'डीलर कोटेशन'],
  },
  {
    id: 'power_tiller',
    name: 'पावर टिलर (Power Tiller - 8 से 15 BHP)',
    approxCost: 170000,
    generalSubsidyPercent: 40,
    generalMaxCap: 68000,
    scStSubsidyPercent: 50,
    scStMaxCap: 85000,
    chcSubsidyPercent: 80,
    chcMaxCap: 136000,
    documents: ['किसान पंजीकरण संख्या (DBT ID)', 'आधार कार्ड', 'जमीन की अद्यतन रसीद', 'जाति प्रमाण पत्र (SC/ST के लिए)'],
  },
  {
    id: 'thresher',
    name: 'मल्टी-क्रॉप थ्रेशर (Multi-Crop Thresher)',
    approxCost: 180000,
    generalSubsidyPercent: 40,
    generalMaxCap: 72000,
    scStSubsidyPercent: 50,
    scStMaxCap: 90000,
    chcSubsidyPercent: 80,
    chcMaxCap: 144000,
    documents: ['किसान पंजीकरण संख्या (DBT ID)', 'आधार कार्ड एवं बैंक पासबुक', 'जमीन की रसीद', 'GST बिल'],
  },
  {
    id: 'chc_bank',
    name: 'कस्टम हायरिंग सेंटर (CHC - पूर्ण यंत्र बैंक स्थापना)',
    approxCost: 1000000,
    generalSubsidyPercent: 40,
    generalMaxCap: 400000,
    scStSubsidyPercent: 40,
    scStMaxCap: 400000,
    chcSubsidyPercent: 80,
    chcMaxCap: 800000,
    documents: ['जीविका समूह / FPO / पैक्स पंजीकरण प्रमाण पत्र', 'प्रोजेक्ट रिपोर्ट (DPR)', 'समूह का बैंक खाता विवरण', 'सभी सदस्यों का आधार व किसान ID'],
  },
];

const SubsidyCalculator = () => {
  const [selectedMachineId, setSelectedMachineId] = useState('rotavator');
  const [applicantCategory, setApplicantCategory] = useState('general'); // 'general' | 'sc_st' | 'chc_fpo'
  const [customPrice, setCustomPrice] = useState(110000);

  const selectedMachine = useMemo(
    () => SUBSIDY_MACHINES.find((m) => m.id === selectedMachineId) || SUBSIDY_MACHINES[0],
    [selectedMachineId]
  );

  // यंत्र बदलने पर उसकी अनुमानित कीमत अपडेट करें
  const handleMachineChange = (id) => {
    setSelectedMachineId(id);
    const found = SUBSIDY_MACHINES.find((m) => m.id === id);
    if (found) setCustomPrice(found.approxCost);
  };

  // लाइव सब्सिडी गणना
  const calculation = useMemo(() => {
    const price = Math.max(0, Number(customPrice) || 0);
    let percent = selectedMachine.generalSubsidyPercent;
    let maxCap = selectedMachine.generalMaxCap;
    let schemeName = 'SMAM / राज्य कृषि यांत्रिकरण योजना (व्यक्तिगत किसान)';

    if (applicantCategory === 'sc_st') {
      percent = selectedMachine.scStSubsidyPercent;
      maxCap = selectedMachine.scStMaxCap;
      schemeName = 'विशेष घटक / जनजातीय उप-योजना (SC / ST किसान)';
    } else if (applicantCategory === 'chc_fpo') {
      percent = selectedMachine.chcSubsidyPercent;
      maxCap = selectedMachine.chcMaxCap;
      schemeName = 'कस्टम हायरिंग सेंटर / FPO / जीविका समूह (80% अनुदान)';
    }

    const rawSubsidy = Math.round((price * percent) / 100);
    const finalSubsidy = Math.min(rawSubsidy, maxCap);
    const farmerShare = Math.max(0, price - finalSubsidy);

    return {
      price,
      percent,
      maxCap,
      finalSubsidy,
      farmerShare,
      schemeName,
    };
  }, [selectedMachine, applicantCategory, customPrice]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 text-white shadow-xl">
        <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Landmark className="w-3.5 h-3.5" />
          <span>बिहार कृषि विभाग (SMAM एवं CHC अनुदान कैलकुलेटर)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          🏛️ सरकारी कृषि यंत्र सब्सिडी कैलकुलेटर (40% से 80% छूट)
        </h2>
        <p className="text-sm text-emerald-100 mt-1.5 max-w-2xl">
          नया ट्रैक्टर उपकरण या कस्टम हायरिंग सेंटर (CHC) खोलने से पहले जानें कि बिहार सरकार की योजना से आपको कितनी सब्सिडी मिलेगी और आवश्यक दस्तावेज़ क्या हैं।
        </p>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (7 Columns) */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-lg p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calculator className="w-5 h-5 text-emerald-700" />
            <h3 className="text-lg font-bold text-slate-800">1. अपनी पात्रता और कृषि यंत्र चुनें</h3>
          </div>

          {/* Step A: Applicant Category */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              आवेदक की श्रेणी चुनें (Applicant Category):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setApplicantCategory('general')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  applicantCategory === 'general'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold block">सामान्य / पिछड़ा वर्ग</span>
                <span className={`text-[11px] ${applicantCategory === 'general' ? 'text-emerald-200' : 'text-slate-500'}`}>
                  40% से 50% तक अनुदान
                </span>
              </button>

              <button
                type="button"
                onClick={() => setApplicantCategory('sc_st')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  applicantCategory === 'sc_st'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold block">SC / ST किसान</span>
                <span className={`text-[11px] ${applicantCategory === 'sc_st' ? 'text-emerald-200' : 'text-slate-500'}`}>
                  50% से 60% तक अनुदान
                </span>
              </button>

              <button
                type="button"
                onClick={() => setApplicantCategory('chc_fpo')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  applicantCategory === 'chc_fpo'
                    ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> FPO / जीविका / CHC
                </span>
                <span className={`text-[11px] ${applicantCategory === 'chc_fpo' ? 'text-amber-950 font-semibold' : 'text-slate-500'}`}>
                  80% तक बंपर सब्सिडी
                </span>
              </button>
            </div>
          </div>

          {/* Step B: Select Machine */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Tractor className="w-4 h-4 text-emerald-700" />
              कृषि यंत्र चुनें:
            </label>
            <select
              value={selectedMachineId}
              onChange={(e) => handleMachineChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            >
              {SUBSIDY_MACHINES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — अनुमानित मूल्य ₹{m.approxCost.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* Step C: Machine Cost Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              यंत्र की कुल बाजार कीमत (₹ में — आप बदल भी सकते हैं):
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="number"
                min="1000"
                step="1000"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              आवेदन के लिए आवश्यक दस्तावेज़:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
              {selectedMachine.documents.map((doc, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Live Subsidy Result Card (5 Columns) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-700/60 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-800/80 border border-emerald-600 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>अनुमानित सरकारी अनुदान विवरण</span>
            </div>

            <div>
              <span className="text-xs text-emerald-300 block">लागू योजना:</span>
              <p className="text-sm font-bold text-white mt-0.5">{calculation.schemeName}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-200">यंत्र की कुल कीमत:</span>
                <span className="font-bold text-sm">₹{calculation.price.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-200">अनुदान प्रतिशत (अधिकतम सीमा ₹{calculation.maxCap.toLocaleString('en-IN')}):</span>
                <span className="bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded-md">
                  {calculation.percent}% छूट
                </span>
              </div>

              <div className="border-t border-white/15 pt-3 flex justify-between items-center">
                <span className="text-xs text-amber-300 font-semibold">सरकार से मिलने वाली सब्सिडी:</span>
                <span className="text-2xl font-extrabold text-amber-300">
                  - ₹{calculation.finalSubsidy.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-emerald-800/60 rounded-2xl p-4 border border-emerald-600/50 flex justify-between items-center">
              <div>
                <span className="text-xs text-emerald-200 block">किसान / समूह को देय राशि:</span>
                <span className="text-[11px] text-emerald-300">(सब्सिडी कटने के बाद शुद्ध लागत)</span>
              </div>
              <span className="text-2xl font-extrabold text-white">
                ₹{calculation.farmerShare.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Official Bihar Agriculture Portal Links */}
          <div className="space-y-2.5 pt-2">
            <a
              href="https://farmech.bih.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>बिहार कृषि यांत्रिकरण पोर्टल (OFMAS) पर आवेदन करें</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href="https://dbtagriculture.bihar.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white/15 hover:bg-white/25 text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/25 transition-colors"
            >
              <span>किसान पंजीकरण (DBT Agriculture Bihar) जाँचें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsidyCalculator;