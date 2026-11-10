import React, { useState } from 'react';
import { X, Calculator, ArrowRightLeft } from 'lucide-react';

const LandCalculatorModal = ({ onClose }) => {
  const [katha, setKatha] = useState(20);

  // बिहार मानक अनुमानित गणना
  const bigha = (katha / 20).toFixed(2);
  const dismil = (katha * 3.125).toFixed(2);
  const acre = (katha / 32).toFixed(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">बिहार भूमि मापक कैलकुलेटर</h2>
            <p className="text-xs text-slate-500">कट्ठा, बीघा, डिसमिल व एकड़ का सीधा रूपांतरण</p>
          </div>
        </div>

        <div className="space-y-4 my-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              क्षेत्रफल दर्ज करें (कट्ठा में):
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={katha}
              onChange={(e) => setKatha(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-base font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center py-1 border-b border-emerald-100">
              <span className="text-slate-600">बीघा (Bigha):</span>
              <span className="font-bold text-sm text-emerald-900">{bigha} बीघा</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-emerald-100">
              <span className="text-slate-600">डिसमिल (Dismil):</span>
              <span className="font-bold text-sm text-emerald-900">{dismil} डिसमिल</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">एकड़ (Acre):</span>
              <span className="font-bold text-sm text-emerald-900">{acre} एकड़</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            *नोट: बिहार के कुछ क्षेत्रों (लग्गी के नाप) अनुसार कट्ठा का आकार थोड़ा भिन्न हो सकता है। यह सामान्य 20 कट्ठा = 1 बीघा मानक पर आधारित है।
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 rounded-xl text-xs"
        >
          ठीक है
        </button>
      </div>
    </div>
  );
};

export default LandCalculatorModal;