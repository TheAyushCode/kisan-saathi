import React from 'react';
import { Phone, MapPin, Tag, CheckCircle2 } from 'lucide-react';

const MachineCard = ({ machine, onBook }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg text-slate-800">{machine.name}</h3>
          {machine.isSubsidized && (
            <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200 whitespace-nowrap">
              सरकारी अनुदान
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {machine.type}
        </p>

        <div className="space-y-1.5 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{machine.block}, {machine.district}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>मालिक: {machine.ownerName} ({machine.ownerPhone})</span>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-4">
          <div className="text-xs text-amber-800 font-medium">किराया दर:</div>
          <div className="text-base font-bold text-amber-900 mt-0.5">
            ₹{machine.ratePerHour} <span className="text-xs font-normal">/ घंटा</span>
            {machine.ratePerKatha > 0 && (
              <span className="text-xs text-amber-800 ml-2 font-normal">
                (या ₹{machine.ratePerKatha} / कट्ठा)
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onBook(machine)}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
      >
        <CheckCircle2 className="w-4 h-4" />
        बुकिंग अनुरोध भेजें
      </button>
    </div>
  );
};

export default MachineCard;