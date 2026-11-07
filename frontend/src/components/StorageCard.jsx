import React from 'react';
import { Warehouse, MapPin, Phone, Thermometer, Truck } from 'lucide-react';

const StorageCard = ({ storage, onBook }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg text-slate-800">{storage.name}</h3>
          <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-200 whitespace-nowrap">
            {storage.type}
          </span>
        </div>

        <div className="space-y-1.5 text-sm text-slate-600 mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{storage.block}, {storage.district}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>संचालक: {storage.operatorPhone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>तापमान: {storage.temperatureRange}</span>
          </div>
        </div>

        {/* Crops tags */}
        <div className="mb-4">
          <span className="text-xs text-slate-500 font-medium block mb-1.5">अनुकूल फ़सलें:</span>
          <div className="flex flex-wrap gap-1.5">
            {storage.suitableForCrops?.map((crop, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md">
                {crop}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
          <div>
            <div className="text-[11px] text-slate-500">उपलब्ध क्षमता</div>
            <div className="font-bold text-emerald-700 text-sm">
              {storage.availableCapacityQuintals} <span className="text-xs font-normal">क्विंटल</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500">मासिक दर</div>
            <div className="font-bold text-slate-800 text-sm">
              ₹{storage.ratePerQuintalMonth} <span className="text-xs font-normal">/ क्विं.</span>
            </div>
          </div>
        </div>

        {storage.sharedTransportAvailable && (
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>शेयर्ड पिकअप व परिवहन सुविधा उपलब्ध</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onBook(storage)}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-xl transition-colors text-sm shadow-sm"
      >
        गोदाम स्लॉट बुक करें
      </button>
    </div>
  );
};

export default StorageCard;